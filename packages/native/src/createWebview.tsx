import WebView, {type  WebViewProps } from 'react-native-webview';
import {  bridge } from './bridge';
import { createRef } from 'react';
import dedent from "ts-dedent";

type LinkBridgePersist = {
  localStorage: string[]
}

interface CreateWebviewArgs {
  bridge: ReturnType<typeof bridge>;
  host: string;
  persist: LinkBridgePersist;
} 

export const createWebview = ({ bridge,host }: CreateWebviewArgs) => {
  const webviewRef = createRef<WebView>();

  const bridgeNames = Object.values(bridge ?? {})
    .map((func) => {
      return `'${func.name}'`;
    })
    .join();

  return {
    Webview: (props: WebViewProps) => <WebView 
    ref={webviewRef}
    source={{ uri: host }}
    onMessage={async (event) => {
      const {method , args} = JSON.parse(event.nativeEvent.data);
      const response = await bridge[method]?.(...args);

      webviewRef.current?.injectJavaScript(dedent`
      window.bridgeEmitter.emit('${method}',${JSON.stringify(response)});
    
      true;
      `);
    }}
    injectedJavaScriptBeforeContentLoaded={dedent`
      window.__bridgeSchema__ = [${bridgeNames}];
      
      true;
      `}
    
    {...props} />
  };
};
