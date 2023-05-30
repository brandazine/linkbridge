import {createWebview} from '@linkbridge/native';
import {bridge} from '@linkbridge/native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';

export const appBridge = bridge({
  getMessage: () => {
    return "I'm from native";
  },
  openInAppBrowser: async (url: string) => {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url);
    }
  },
});

export type AppBridge = typeof appBridge;

export const {Webview} = createWebview({
  bridge: appBridge,
  host: 'http://localhost:5173',
  debug: true,
});
