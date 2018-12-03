import { Flow, Mode } from "../enums";

export interface IConfig {
  appName: string;
  mode: Mode;
  flow: Flow;
  requireConsent: boolean;
}
