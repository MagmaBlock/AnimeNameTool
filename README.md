# AnimeNameTool

A parser for japanese anime filenames.

With full typescript support.

## Links

- GitHub: https://github.com/MagmaBlock/AnimeNameTool
- NPM: https://www.npmjs.com/package/anime-name-tool

## Usage

1. Install this packege by your package manager.
2. Import it.

```javascript
import { parseFileName } from "anime-name-tool";

const result = parseFileName(
  "[Sakurato] RWBY Hyousetsu Teikoku [05][HEVC-10bit 1080p AAC][CHS&CHT].mp4"
);

console.log(result);
```

3. See the result.

```javascript
{
  title: 'RWBY Hyousetsu Teikoku',
  year: null,
  episode: 5,
  episodeIndex: { index: 35, length: 2, content: '05' },
  group: [ { name: 'Sakurato', parsedName: '桜都字幕组' } ],
  groupIndex: { index: 0, length: 10, content: '[Sakurato]' },
  subtitle: { language: [ 'CHS', 'CHT' ], subtitleFeatures: [] },
  source: { broadcastChannel: [], mediaType: [] },
  quality: {
    videoCodec: 'HEVC',
    audioCodec: 'AAC',
    resolution: '1080P',
    fps: null,
    color: '10bit'
  },
  extension: { name: 'mp4', parsedName: 'MP4', type: 'Video' }
}
```

## TypeScript

This package is full typed. The result of `parseFileName` is typed as `ParseResult`.

See type definition [here](https://github.com/MagmaBlock/AnimeNameTool/blob/main/src/result/result.ts).
