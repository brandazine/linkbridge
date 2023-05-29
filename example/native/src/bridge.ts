import {createWebview} from '@linkbridge/native';
import {bridge} from '@linkbridge/native';

export const appBridge = bridge({
  openInAppBrowser: () => {
    return 'ASD';
  },
  openInAppBrowser2: async (arg: string) => {
    return arg;
  },
});

export type AppBridge = typeof appBridge;

export const {Webview} = createWebview({
  bridge: appBridge,
  host: 'http://localhost:5173',
  persist: {
    localStorage: ['token'],
  },
  debug: true,
});
