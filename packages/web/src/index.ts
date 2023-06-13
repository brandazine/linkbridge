import { createNanoEvents } from "nanoevents";
import { nanoid } from "nanoid/non-secure";

const createTimeout = () => ({
  timerId: 0,
  timeout(timeout: number) {
    return new Promise((_, reject) => {
      this.timerId = setTimeout(() => {
        reject(new Error("Timeout"));
      }, timeout);
    });
  },
});

const createResolver = (method: string, eventId: string) => {
  return new Promise((resolve) => {
    const unbind = emitter.on(`${method}-${eventId}`, (data) => {
      unbind();
      resolve(data);
    });
  });
};

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

        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: "bridge",
            method,
            eventId,
            args,
          })
        );

        const { timerId, timeout } = createTimeout();

        return Promise.race([
          createResolver(method, eventId),
          timeout(options.timeout),
        ]).finally(() => clearTimeout(timerId));
      },
    };
  }, {} as T);
};
