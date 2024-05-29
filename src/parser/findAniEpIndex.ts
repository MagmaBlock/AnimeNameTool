import aniep from "aniep";

/**
 * 寻找文件名中 aniep 库找到的集数的索引
 * @param fileName 文件名
 * @param aniepEpisode 指定集数的字符串，而不是默认使用 aniep 解析。此项用于函数自身递归调用
 */
export function findAniEpIndex(
  fileName: string,
  aniepEpisode?: string | number | number[]
): {
  index: number; // 集数的数字的首个字符的索引
  length: number; // 长度
  content: string; // 集数字符串
} | null {
  const episode = aniepEpisode ?? aniep(fileName);
  const clearFileName = replaceNumberInFileName(fileName);

  // xxx [01] xxx
  if (typeof episode == "number") {
    const episodeStr = episode.toString();
    let paddingLengths = [3, 2, 1]; // 填充长度的优先级顺序
    // 如果集数含有小数，如 "2.5"，那么此时最短就是三位了，最好从 "002.5" 找起
    if (episodeStr.match(/\./)) {
      paddingLengths = [5, 4, 3];
    }

    // 按照 001, 01, 1 的左 padding 来寻找
    for (const length of paddingLengths) {
      const paddingEpisode = episodeStr.padStart(length, "0");
      const index = clearFileName.indexOf(paddingEpisode);
      if (index !== -1) {
        return {
          index: index,
          length: paddingEpisode.length,
          content: paddingEpisode,
        };
      }
    }
  }
  // Xxxxx Xxx - 01-02 (MX 1280x720) -> [1, 2]
  // 简单范围集数的复合情况
  if (Array.isArray(episode)) {
    // 通过递归自调用的方式分别获取两个集数的位置情况
    const first = findAniEpIndex(fileName, episode[0]);
    const second = findAniEpIndex(fileName, episode[1]);

    if (first && second && first?.index !== -1 && second?.index !== -1) {
      const index = Math.min(first.index, second.index);
      let length;
      if (second.index > first.index) {
        length = second.index - first.index + second.length;
      } else {
        length = first.index - second.index + first.length;
      }
      const episodeString = fileName.slice(index, index + length);

      return {
        index: index,
        length: length,
        content: episodeString,
      };
    }
  }
  // 9.5|21.5, 文件名包含两种集数表达方式
  if (typeof episode == "string" && episode.includes("|")) {
    // 仅仅是单集的两种表达方式情况：
    // 281|501 [SOSG&52wy][Naruto_Shippuuden][501(281)][BIG5][x264_AAC][1280x720].mp4
    if (!episode.includes(",")) {
      // 分别寻找两种数字的位置
      const [first, second] = episode.split("|");

      // 如果无法解析数字，则返回 null
      if (Number.isNaN(Number(first)) || Number.isNaN(Number(second))) {
        return null;
      }

      const firstIndex = findAniEpIndex(fileName, Number(first));
      const secondIndex = findAniEpIndex(fileName, Number(second));

      // 如果无法找到任一一种表达方式的索引，则返回 null
      if (!firstIndex || !secondIndex) return null;

      // 最小的索引是集数开始的位置
      const index = Math.min(firstIndex.index, secondIndex.index);
      // 长度应该是在前的集数的索引到在后的集数的结束位置
      let length;
      if (secondIndex.index > firstIndex.index) {
        length = secondIndex.index - firstIndex.index + secondIndex.length;
      } else {
        length = firstIndex.index - secondIndex.index + firstIndex.length;
      }

      let episodeString = fileName.slice(index, index + length);

      // 处理一下带括号而后面的括号没被计算进内的问题，如 `501(281)` 处理到这行仅仅只截到了 `501(281`
      if (episodeString.match(/\(|（/)) {
        if (fileName[index + length] === ")") {
          length = length + 1;
          episodeString = fileName.slice(index, index + length);
        } else if (fileName[index + length] === "）") {
          length = length + 1;
          episodeString = fileName.slice(index, index + length);
        } else if (fileName[index + length + 1] === ")") {
          length = length + 2;
          episodeString = fileName.slice(index, index + length);
        } else if (fileName[index + length + 1] === "）") {
          length = length + 2;
          episodeString = fileName.slice(index, index + length);
        }
      }

      return {
        index: index,
        length: length,
        content: episodeString,
      };
    }
    // 复杂情况：集数不仅仅用了两种表达方式，而且还是多集
    // (谁发明的这种写法)
    // 427,647|428,648 [XFSUB][Naruto Shippuuden][647-427_648-428][BIG5][x264 1280x720 AAC].mp4
    else {
      const [firstMethod, secondMethod] = episode.split("|");
      if (firstMethod.includes(",") && secondMethod.includes(",")) {
        const firstArray = firstMethod.split(",").map((obj) => Number(obj));
        const secondArray = secondMethod.split(",").map((obj) => Number(obj));

        // 集数不能无法解析为数字
        if ([...firstArray, ...secondArray].find((obj) => Number.isNaN(obj))) {
          return null;
        }

        const first = findAniEpIndex(fileName, firstArray);
        const second = findAniEpIndex(fileName, secondArray);

        if (!first || !second) return null;

        const index = Math.min(first.index, second.index);
        let length;
        if (second.index > first.index) {
          length = second.index - first.index + second.length;
        } else {
          length = first.index - second.index + first.length;
        }

        let episodeString = fileName.slice(index, index + length);

        // 同上，处理一下带括号而后面的括号没被计算进内的问题，如 `501(281)` 处理到这行仅仅只截到了 `501(281`
        if (episodeString.match(/\(|（/)) {
          if (fileName[index + length] === ")") {
            length = length + 1;
            episodeString = fileName.slice(index, index + length);
          } else if (fileName[index + length] === "）") {
            length = length + 1;
            episodeString = fileName.slice(index, index + length);
          } else if (fileName[index + length + 1] === ")") {
            length = length + 2;
            episodeString = fileName.slice(index, index + length);
          } else if (fileName[index + length + 1] === "）") {
            length = length + 2;
            episodeString = fileName.slice(index, index + length);
          }
        }

        return {
          index,
          length,
          content: episodeString,
        };
      }
    }
  }
  if (episode === null) {
  }

  return null;
}

/**
 * 将文件名中除了集数外可能的数字全部替换为 ####，由 aniep 库改编而来。
 * 本方法是为了获取 aniep 库找到的集数的索引。
 */
export function replaceNumberInFileName(fileName: string) {
  // 定义替换函数
  function replaceWithPlaceholder(match: string) {
    return "#".repeat(match.length);
  }

  let clearFileName = fileName;
  clearFileName = clearFileName.replace(/[\r\n]$/, replaceWithPlaceholder);
  clearFileName = clearFileName.replace(
    /((?:\.mp4|\.mkv)+)$/,
    replaceWithPlaceholder
  ); // remove file extension
  clearFileName = clearFileName.replace(/(v\d)$/i, replaceWithPlaceholder); // remove v2, v3 suffix
  clearFileName = clearFileName.replace(
    /(?<=\d)v[0-5]/i,
    replaceWithPlaceholder
  ); // remove v2 from 13v2
  clearFileName = clearFileName.replace(
    /(x|h)26(4|5)/i,
    replaceWithPlaceholder
  ); // remove x264 and x265
  clearFileName = clearFileName.replace(/\bmp4\b/i, replaceWithPlaceholder); // remove x264 and x265
  clearFileName = clearFileName.replace(/(8|10)-?bit/i, replaceWithPlaceholder); // remove 10bit and 10-bit
  clearFileName = clearFileName.replace(
    /(\[[0-9a-fA-F]{6,8}])/,
    replaceWithPlaceholder
  ); // remove checksum like [c3cafe11]
  clearFileName = clearFileName.replace(/(\[\d{5,}])/, replaceWithPlaceholder);
  clearFileName = clearFileName.replace(
    /\d\d\d\d-\d\d-\d\d/,
    replaceWithPlaceholder
  ); // remove dates like [20190301]
  clearFileName = clearFileName.replace(
    /\d{3,4}\s*(?:x|×)\s*\d{3,4}p?/i,
    replaceWithPlaceholder
  ); // remove dates like yyyy-mm-dd
  clearFileName = clearFileName.replace(
    /(?:2160|1080|720|480)(?:p|i)/i,
    replaceWithPlaceholder
  ); // remove resolutions like 720p or 1080i
  clearFileName = clearFileName.replace(
    /(?:3840|1920|1280)[-_](?:2160|1080|720)/,
    replaceWithPlaceholder
  ); // remove resolutions like 1280x720
  clearFileName = clearFileName.replace(/2k|4k/i, replaceWithPlaceholder); // remove resolutions 2k or 4k
  clearFileName = clearFileName.replace(
    /((19|20)\d\d)/,
    replaceWithPlaceholder
  ); // remove years like 1999 or 2019
  clearFileName = clearFileName.replace(/\(BD\)/, replaceWithPlaceholder); // remove resolution like (BD)
  clearFileName = clearFileName.replace(/\(DVD\)/, replaceWithPlaceholder); // remove format like (DVD)

  return clearFileName;
}
