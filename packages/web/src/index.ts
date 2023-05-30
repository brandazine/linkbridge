import { createNanoEvents } from "nanoevents";
import { nanoid } from "nanoid/non-secure";
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

  return bridgeSchema.reduce((acc, method) => {
    return {
      ...acc,
      [method]: (...args: any[]) => {
        const eventId = nanoid();

        return new Promise((resolve, reject) => {
          const unbind = emitter.on(`${method}-${eventId}`, (data) => {
            unbind();
            resolve(data);
          });

          setTimeout(() => {
            reject(new Error("Timeout"));
          }, options.timeout);

          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: "bridge",
              method,
              eventId,
              args,
            })
          );
        });
      },
    };
  }, {} as T);
};
