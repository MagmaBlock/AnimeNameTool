export const videoCodecMap = new Map<RegExp, string>();

videoCodecMap.set(/(AVC|x(\.){0,1}264|H(\.){0,1}264)/gi, "AVC");
videoCodecMap.set(/(HEVC|x(\.){0,1}265|H(\.){0,1}265)/gi, "HEVC");
videoCodecMap.set(/(VP8)/gi, "VP8");
videoCodecMap.set(/(VP9)/gi, "VP9");
videoCodecMap.set(/(AV1)/gi, "AV1");

export const audioCodecMap = new Map<RegExp, string>();

audioCodecMap.set(/(\d(AAC|ACC))|((AAC|ACC)(x|×)\d)|(ACC|AAC)/gi, "AAC");
audioCodecMap.set(/FLAC(x|×)\d|\dFLAC|FLAC/gi, "FLAC");
audioCodecMap.set(/OPUS(x|×)\d|\dOPUS|OPUS/gi, "OPUS");
audioCodecMap.set(/AC3/gi, "Dolby Surround Digital");

export const resolutionMap = new Map<RegExp, string>();

resolutionMap.set(/360P|(640|480)[X×\*](360)/gi, "360P");
resolutionMap.set(/480P|(854|640)[X×\*](480)/gi, "480P");
resolutionMap.set(/720P|(1280|)[X×\*](720|960)/gi, "720P");
resolutionMap.set(/1080P|(1920|1440)[X×\*](1080|1440|816)/gi, "1080P");
resolutionMap.set(/1440P|2K|(2560)[X×\*](1440)/gi, "2K");
resolutionMap.set(/2160P|4K|(3840)[X×\*](2160)/gi, "4K");

export const fpsMap = new Map<RegExp, string>();

fpsMap.set(/23\.976FPS/gi, "23.976FPS");
fpsMap.set(/24FPS/gi, "24FPS");
fpsMap.set(/25FPS/gi, "25FPS");
fpsMap.set(/30FPS/gi, "30FPS");
fpsMap.set(/35FPS/gi, "35FPS");
fpsMap.set(/40FPS/gi, "40FPS");
fpsMap.set(/45FPS/gi, "45FPS");
fpsMap.set(/50FPS/gi, "50FPS");
fpsMap.set(/55FPS/gi, "55FPS");
fpsMap.set(/60FPS/gi, "60FPS");

export const colorMap = new Map<RegExp, string>();

colorMap.set(/Hi10p|10Bits|10Bit|Ma10p/gi, "10bit");
colorMap.set(/8Bits|8Bit/gi, "10bit");
colorMap.set(/yuv420p10/gi, "YUV-4:2:0 10bit");
colorMap.set(/yuv420p8/gi, "YUV-4:2:0 8bit");
colorMap.set(/Main10/gi, "Profile Main10");
