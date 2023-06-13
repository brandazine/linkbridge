import { createNanoEvents } from "nanoevents";
import { nanoid } from "nanoid/non-secure";

const timeout = (timeout: number) =>
  new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Timeout"));
    }, timeout);
  });

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
      [method]: (...args: unknown[]) => {
        const eventId = nanoid();

        const resolver = new Promise((resolve) => {
          const unbind = emitter.on(`${method}-${eventId}`, (data) => {
            unbind();
            resolve(data);
          });
        });

        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: "bridge",
            method,
            eventId,
            args,
          })
        );

        return Promise.race([resolver, timeout(options.timeout)]);
      },
    };
  }, {} as T);
};
