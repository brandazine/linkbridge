import { createNanoEvents } from "nanoevents";

const emitter = createNanoEvents();

export const createBridge = <T = unknown>(
  options = {
    timeout: 2000,
  }
) => {
  const bridgeSchema = window.__bridgeSchema__;
  if (!bridgeSchema || !window.ReactNativeWebView) {
    throw new Error("Not connected with react native.");
  }

  if (!window.bridgeEmitter) {
    window.bridgeEmitter = emitter;
  }

  return bridgeSchema.reduce((acc, name) => {
    return {
      ...acc,
      [name]: (...args: any[]) => {
        return new Promise((resolve, reject) => {
          const unbind = emitter.on(`${name}`, (data) => {
            unbind();
            resolve(data);
          });

          setTimeout(() => {
            reject(new Error("Timeout"));
          }, options.timeout);

          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              method: name,
              args,
            })
          );
        });
      },
    };
  }, {} as T);
};
