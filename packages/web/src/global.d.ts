export {};

declare global {
  interface Window {
    __bridgeSchema__?: string[];
    bridgeEmitter?: Emitter<DefaultEvents>;
    ReactNativeWebView: {
      postMessage: (data: string) => void;
    };
  }
}