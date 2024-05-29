export enum Language {
  ChineseSimplified = "CHS",
  ChineseTraditional = "CHT",
  Chinese = "ZH",
  Japanese = "JPN",
  English = "ENG",
  Thai = "TH",
}

export const languageMap = new Map<RegExp, Language[]>();

languageMap.set(/\b(GB_CN|GB|SC|CHS|CHI|简体中文|简体|简中|簡體)\b/gi, [
  Language.ChineseSimplified,
]);
languageMap.set(/\b(BIG5|TC|CHT|繁中|繁体中文|繁體中文|繁体)\b/gi, [
  Language.ChineseTraditional,
]);
languageMap.set(/\b(JPN|JAP|JP)\b/gi, [Language.Japanese]);
languageMap.set(/\b(ENG|EN)\b/gi, [Language.English]);
languageMap.set(/\b(CH|ZH)\b/gi, [Language.Chinese]);
languageMap.set(/\b(TH|Thai)\b/gi, [Language.Thai]);

languageMap.set(
  /\b(JPSC|(GB|SC|CHS|CHI)(&|,|_|\+)(JPN|JP|JAP)|简体双语|中日双语)\b/gi,
  [Language.Japanese, Language.ChineseSimplified]
);
languageMap.set(
  /\b(JSTC|(CHT|TC|BIG5)(&|,|_|\+)(JPN|JP|JAP)|繁日双语|繁日雙語|中日雙字幕)\b/gi,
  [Language.Japanese, Language.ChineseTraditional]
);
languageMap.set(
  /\b((CHS|SC|GB)(&|,|_|\+)(CHT|TC|BIG5)(&|,|_|\+)(JPN|JP|JAP)|简繁日|简繁日多语|简繁日三语)\b/gi,
  [Language.Japanese, Language.ChineseSimplified, Language.ChineseTraditional]
);

export const subtitleFeaturesMap = new Map<RegExp, string>();

subtitleFeaturesMap.set(/ASS|SSA|ASS[x×]\d/gi, "ASS/SSA");
subtitleFeaturesMap.set(/SRT|SRT(x|×)\d/gi, "SRT");
subtitleFeaturesMap.set(/V2/gi, "Version 2");
subtitleFeaturesMap.set(/V3/gi, "Version 3");
subtitleFeaturesMap.set(/LavaASS/gi, "LavaAnimeLibMKV(deprecated)");
