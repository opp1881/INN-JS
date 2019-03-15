import { Mode } from '../enums';

export interface IConfig {
  appName: string;
  mode: Mode;
  profileUrl?: string;
  profileBackgroundUrl?: string;
  proxyUrl?: string;
}
