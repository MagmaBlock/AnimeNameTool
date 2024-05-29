import aniep from "aniep";
import _ from "lodash";
import chineseParseInt from "chinese-parseint2";
import { groupMap } from "../map/group";
import { ParseResult } from "../result/result";
import { findAniEpIndex } from "./findAniEpIndex";
import path from "path/posix";
import { extensionMap } from "../map/format";
import { broadcastChannelMap, mediaTypeMap } from "../map/source";
import {
  audioCodecMap,
  colorMap,
  fpsMap,
  resolutionMap,
  videoCodecMap,
} from "../map/quality";
import { languageMap, subtitleFeaturesMap } from "../map/subtitle";

/**
 * [異域字幕組][學戰都市Asterisk 第二期][The Asterisk War S2][08_20][v2][1280x720][繁體].mp4
 * [philosophy-raws][Casshern Sins][12][BDRIP][x264 AAC][1920X1080].mp4
 * [Nekomoe kissaten][Genkoku][20][720p][JPTC].mp4
 * [Lilith-Raws] Iwakakeru! Climbing Girls - 05 [Baha][WEB-DL][1080p][AVC AAC][CHT][MKV].mp4
 * [Ohys-Raws] Kaze ga Tsuyoku Fuite Iru - 22 (NTV 1280x720 x264 AAC).mp4
 * [SEVENSTARS-ARMY][Yu-Gi-Oh SEVENS][015][GB_JP][720P][x264_AAC].mp4
 * [SGS&CASO][Sakamichi_no_Apollon][10][GB][1280x720][x264_AAC][33151367].mp4
 * Watashi ni Tenshi ga Maiorita! 04 [0067B767].mp4
 * 解析如以上的文件名到 ParseResult
 */
export function parseFileName(fileName: string) {
  if (typeof fileName !== "string") throw new Error("fileName must be string");
  fileName = fileName.trim();

  const result = new ParseResult();

  result.episode = aniep(fileName);
  result.episodeIndex = findAniEpIndex(fileName);

  tryParseFirstBlock(fileName, result);
  tryParseTitle(fileName, result);
  tryParseExtension(fileName, result);
  tryParseSource(fileName, result);
  tryParseSubtitle(fileName, result);

  return result;
}

/**
 * 解析组名等会出现在首个块中的元素
 * @returns 解析组名后，剩下的部分
 */
function tryParseFirstBlock(fileName: string, result: ParseResult) {
  // 匹配文件名开头 [] 或 【】 中的内容
  // const catchFirstBlock = fileName.match(/(?<=^(\[|【)).*?(?=(\]|】))/);
  const catchFirstBlockWithBrackets = fileName.match(/^(\[|【)(.*?)(\]|】)/);
  // 如果文件开头不是块，直接返回
  if (catchFirstBlockWithBrackets === null) return null;
  // 匹配文件名开头 [] 或 【】 整体
  const catchFirstBlock = catchFirstBlockWithBrackets[2];

  // 开始对首个块内容进行匹配
  let matchedCount = 0;
  // 尝试拆分
  const maybeGroups = catchFirstBlock.split(/&|＆|×|\+/);
  // 尝试对每个组名进行匹配
  for (let maybeGroup of maybeGroups) {
    maybeGroup = maybeGroup.trim();

    // 用词典匹配组名
    const matchResult = Array.from(groupMap.entries()).find(([reg, name]) => {
      if (new RegExp(reg).test(maybeGroup)) return true;
    });

    if (matchResult) {
      result.group.push({
        name: maybeGroup,
        parsedName: matchResult[1],
      });
      matchedCount++;
    } else {
      result.group.push({
        name: maybeGroup,
        parsedName: maybeGroup,
      });
    }
  }

  // 首块中没有被识别到的发布组，或首个 [] 并非发布组

  // 首个 [] 中仅分割出一个词，且这个词中还有空格逗号感叹号问号全角句号，那么首个 [] 极有可能不是发布组名而是作品名 (如 c.c动漫 的名称)
  // 如果满足此条件，进入当前 if，这时我们判断文件名中不存在发布组名，且这个块应该是作品标题.
  if (
    matchedCount === 0 &&
    maybeGroups.length === 1 &&
    (maybeGroups[0].match(/ |\?|\!|,|？|！|，|。/) ||
      maybeGroups[0].match(/ARTE|RideBack/i))
  ) {
    // 假定首块是标题
    // 为了避免耦合，这里不再直接写入 result.title，而是在下一步的 tryParseTitle 中写入
    // result.title = catchFirstBlock[0].trim();
    result.group = [];
    result.groupIndex = null;
  }

  // 返回首个块的索引和长度等结果
  result.groupIndex = {
    index: fileName.indexOf(catchFirstBlockWithBrackets[0]),
    length: catchFirstBlockWithBrackets[0].length,
    content: catchFirstBlockWithBrackets[0],
  };
}

function tryParseTitle(fileName: string, result: ParseResult) {
  // 如果标题已经存在，不继续处理
  if (result.title !== null) return;

  /**
   * 1. 使用 findAniEpIndex 方法，截取集数和发布组块中间的内容
   */
  if (result.episodeIndex !== null) {
    let maybeTitle: string | string[];

    // 1.1. 如果发布组块存在，截取发布组块中间的内容
    if (result.groupIndex !== null) {
      maybeTitle = fileName.slice(
        result.groupIndex.index + result.groupIndex.length,
        result.episodeIndex.index
      );
    }
    // 1.2. 如果发布组块不存在，截取开头到集数块的内容
    else {
      maybeTitle = fileName.slice(0, result.episodeIndex.index);
    }

    // 寻找年份
    const year = maybeTitle.match(/\(((18|19|20)\d{2})\)/);
    if (year) {
      result.year = parseInt(year[1]);
      maybeTitle = maybeTitle.replace(year[0], "");
    }

    maybeTitle = maybeTitle.trim();

    // 移除结尾“第”
    if (maybeTitle.endsWith("第"))
      maybeTitle = maybeTitle.slice(0, maybeTitle.length - 1);

    // 移除结尾横杠
    if (maybeTitle.endsWith("-"))
      maybeTitle = maybeTitle.slice(0, maybeTitle.length - 1);

    // 用 [ ] _ 还有空格拆开
    maybeTitle = maybeTitle.split(/\[|\]| |\_/);
    // 移除上一个 for 产生的空字符串
    maybeTitle = tidyStringArray(maybeTitle);
    maybeTitle = maybeTitle.join(" ");

    result.title = maybeTitle;
    return;
  }

  /**
   * 2. 备用方案：利用 aniep 找到的集数找出可能的标题文本
   */

  // 不含首个发布组块的剩余部分，用于兼容旧版移植过来的代码（即下面的）
  let pendingPart;
  if (result.groupIndex !== null) {
    pendingPart = fileName.slice(
      result.groupIndex.index + result.groupIndex.length
    );
  } else {
    pendingPart = fileName;
  }

  // 用 [ ] ( ) 还有空格拆开
  let nameNoFirstBlock = pendingPart.split(/\[|\]|\(|\)| /);
  nameNoFirstBlock = _.concat(...nameNoFirstBlock); // 将零散的数组合并
  nameNoFirstBlock = tidyStringArray(nameNoFirstBlock); // trim 和删除空格

  // 删除无用词汇
  for (let i in nameNoFirstBlock) {
    let isGarbage = garbageCleaner(nameNoFirstBlock[i]);
    if (isGarbage) nameNoFirstBlock[i] = "";
  }

  // 移除上一个 for 产生的空字符串
  nameNoFirstBlock = tidyStringArray(nameNoFirstBlock);
  if (result.episode !== null) {
    for (let i in nameNoFirstBlock) {
      // 找到集数的位置
      if (
        parseFloat(nameNoFirstBlock[i]) === result.episode ||
        chineseParseInt(nameNoFirstBlock[i]) == result.episode
      ) {
        let title = "";
        // 将发布组后，集数前的部分进行遍历
        for (let j in nameNoFirstBlock) {
          if (j == i) break; // 遍历到达集数位置，停止遍历
          if (
            nameNoFirstBlock[j].match(
              /(BD|Web|DVD)(Rip|-DL){0,1}|AVC|HEVC|((H|X).{0,1}(264|265))|1080P|720P|480P/i
            )
          )
            break; // fix some bad name
          if (nameNoFirstBlock[j].match(/(OVA|SP|OAD|NCOP|NCED|SONG)\d{0,3}/i))
            break; // OVA SP 等类型到达结尾
          if (nameNoFirstBlock[j].match(/^-|_&/)) continue; // 跳过符号词
          title = title + nameNoFirstBlock[j] + " ";
        }
        // 找到标题文本
        if (title) {
          result.title = title.trim();
          break; // 终止外层遍历避免后方再次出现和集数相同的数字
        }
      }
    }
  }
}

/**
 * 传入一个字符串列表，返回 trim 和删除假值后的结果
 */
function tidyStringArray(list: string[]) {
  for (let i in list) list[i] = list[i].trim(); // 去除首尾空格
  return _.compact(list); // 删除所有空格和假值
}

/**
 * 清理垃圾，用 delete 规则删除没用的词（一般是广告）
 *
 */
function garbageCleaner(word: string) {
  // 垃圾正则
  const garbageDict = [
    /招募(翻译|时轴后期|后期|时轴)/gi,
    /(\d{1,2}|一|四|七|十)月(新|){0,1}番/gi,
    /[A-F\d]{8}/gi, // CRC32 校验码
    /(new-ani.me)/gi,
  ];

  for (let thisDictRegExp of garbageDict) {
    // 遍历此词典的内容
    let thisWordReplaced = word.replace(thisDictRegExp, "").trim();
    if (!thisWordReplaced) return true;
  }
  return false; // 什么也没匹配到，不是垃圾
}

/**
 * 通过词典解析文件名的扩展名
 * @param fileName
 * @param result
 */
function tryParseExtension(fileName: string, result: ParseResult) {
  let extName = path.parse(fileName).ext;
  if (!extName) return;

  extName = extName.toLowerCase();
  extName = extName.replace(/^\./, "");

  const matched = Array.from(extensionMap.entries()).find(
    ([reg, matchResult]) => {
      if (new RegExp(reg).test(extName)) return true;
    }
  );

  if (matched === undefined) return;

  const [reg, matchResult] = matched;

  result.extension.name = extName;
  result.extension.parsedName = matchResult[0];
  result.extension.type = matchResult[1];
}

/**
 * 解析资源的来源信息
 * @param fileName
 * @param result
 */
function tryParseSource(fileName: string, result: ParseResult) {
  let maybeInfoSection = path.parse(fileName).name;

  if (result.episodeIndex !== null) {
    const episodeEndingIndex =
      result.episodeIndex.index + result.episodeIndex.length;

    maybeInfoSection = maybeInfoSection.slice(episodeEndingIndex);
  }

  // 解析发布源
  const matchedBroadcastChannel = Array.from(
    broadcastChannelMap.entries()
  ).filter(([reg, name]) => new RegExp(reg).test(maybeInfoSection));
  if (matchedBroadcastChannel.length) {
    result.source.broadcastChannel = matchedBroadcastChannel.map(
      ([reg, name]) => name
    );
  }

  // 解析媒体类型
  const matchedMediaType = Array.from(mediaTypeMap.entries()).filter(
    ([reg, name]) => new RegExp(reg).test(maybeInfoSection)
  );
  if (matchedMediaType.length) {
    result.source.mediaType = matchedMediaType.map(([reg, name]) => name);
  }

  // 解析视频编码名称
  const matchedVideoCodec = Array.from(videoCodecMap.entries()).find(
    ([reg, name]) => new RegExp(reg).test(maybeInfoSection)
  );
  if (matchedVideoCodec) {
    result.quality.videoCodec = matchedVideoCodec[1];
  }

  // 解析音频编码名称
  const matchedAudioCodec = Array.from(audioCodecMap.entries()).find(
    ([reg, name]) => new RegExp(reg).test(maybeInfoSection)
  );
  if (matchedAudioCodec) {
    result.quality.audioCodec = matchedAudioCodec[1];
  }

  // 解析分辨率名
  const matchedResolution = Array.from(resolutionMap.entries()).find(
    ([reg, name]) => new RegExp(reg).test(maybeInfoSection)
  );
  if (matchedResolution) {
    result.quality.resolution = matchedResolution[1];
  }

  // 解析帧率名
  const matchedFps = Array.from(fpsMap.entries()).find(([reg, name]) =>
    new RegExp(reg).test(maybeInfoSection)
  );
  if (matchedFps) {
    result.quality.fps = matchedFps[1];
  }

  // 解析色彩名
  const matchedColor = Array.from(colorMap.entries()).find(([reg, name]) =>
    new RegExp(reg).test(maybeInfoSection)
  );
  if (matchedColor) {
    result.quality.color = matchedColor[1];
  }
}

/**
 * 解析字幕信息
 * @param fileName
 * @param result
 */
function tryParseSubtitle(fileName: string, result: ParseResult) {
  let maybeInfoSection = path.parse(fileName).name;

  // 解析字幕语言
  const matchedLanguage = Array.from(languageMap.entries()).filter(
    ([reg, language]) => new RegExp(reg).test(maybeInfoSection)
  );
  if (matchedLanguage.length) {
    matchedLanguage.forEach(([reg, language]) => {
      result.subtitle.language = result.subtitle.language.concat(language);
    });

    result.subtitle.language = _.uniq(result.subtitle.language);
  }

  // 解析字幕特点
  const matchedSubtitleFeatures = Array.from(
    subtitleFeaturesMap.entries()
  ).filter(([reg, name]) => new RegExp(reg).test(maybeInfoSection));
  if (matchedSubtitleFeatures.length) {
    matchedSubtitleFeatures.forEach(([reg, name]) => {
      result.subtitle.subtitleFeatures =
        result.subtitle.subtitleFeatures.concat(name);
    });
  }
}
