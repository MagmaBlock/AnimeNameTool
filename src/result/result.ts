import { ExtensionType } from "../map/format";
import { Language } from "../map/subtitle";

export class ParseResult {
  title: string | null;
  year: number | null;
  episode: number | string | number[] | null;
  episodeIndex: {
    index: number;
    length: number;
    content: string;
  } | null;
  group: {
    name: string;
    parsedName: string | null;
  }[];
  groupIndex: {
    index: number;
    length: number;
    content: string;
  } | null;
  subtitle: {
    language: Language[];
    subtitleFeatures: string[];
  };
  source: {
    broadcastChannel: string[];
    mediaType: string[];
  };
  quality: {
    videoCodec: string | null;
    audioCodec: string | null;
    resolution: string | null;
    fps: string | null;
    color: string | null;
  };
  extension: {
    name: string;
    parsedName: string | null;
    type: ExtensionType | null;
  };

  constructor() {
    this.title = null;
    this.year = null;
    this.episode = null;
    this.episodeIndex = null;
    this.group = [];
    this.groupIndex = null;
    this.subtitle = {
      language: [],
      subtitleFeatures: [],
    };
    this.source = {
      broadcastChannel: [],
      mediaType: [],
    };
    this.quality = {
      videoCodec: null,
      audioCodec: null,
      resolution: null,
      fps: null,
      color: null,
    };
    this.extension = {
      name: "",
      parsedName: null,
      type: null,
    };
  }
}
