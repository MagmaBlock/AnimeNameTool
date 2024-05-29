import { readFileSync } from "fs";

export function getFullData(): string[] {
  const full = readFileSync("./test/data/full-data.json", "utf-8");
  return JSON.parse(full);
}

export function getRandomData(chance: number = 0.01) {
  return getFullData().filter(() => Math.random() <= chance);
}

export function getMiniData() {
  return [
    "[異域字幕組][學戰都市Asterisk 第二期][The Asterisk War S2][08_20][v2][1280x720][繁體].mp4",
    "[philosophy-raws][啊啊啊 阿达二啊][Casshern Sins][12][BDRIP][x264 AAC][1920X1080].mp4",
    "[Nekomoe kissaten][Genkoku][20][720p][JPTC].mp4",
    "[Lilith-Raws] Iwakakeru! Climbing Girls - 05 [Baha][WEB-DL][1080p][AVC AAC][CHT][MKV].mp4",
    "[Ohys-Raws] Kaze ga Tsuyoku Fuite Iru - 22 (NTV 1280x720 x264 AAC).mp4",
    "[SEVENSTARS-ARMY][Yu-Gi-Oh SEVENS][015][GB_JP][720P][x264_AAC].mp4",
    "[SGS&CASO][Sakamichi_no_Apollon (2018)][10][GB][1280x720][x264_AAC][33151367].mp4",
    "Watashi ni Tenshi ga Maiorita! 04 [0067B767].mp4",
  ];
}
