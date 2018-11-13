/* tslint:disable */
export {};

declare global {
  interface Window {
    origin: string;
    atob: (data: string) => string;
  }
}
