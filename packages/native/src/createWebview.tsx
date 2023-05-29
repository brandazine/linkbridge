import WebView, {type  WebViewProps } from 'react-native-webview';
import type { Procedure, ProceduresObject } from './integrations';
import { CONSOLE_INTEGRATIONS_SCRIPTS, handleLog, handleBridge } from './integrations';
import { createRef } from 'react';
import dedent from "ts-dedent";

type LinkBridgePersist = {
  localStorage: string[]
}

interface CreateWebviewArgs {
  bridge: ProceduresObject<Record<string, Procedure>>;
  host: string;
  persist?: LinkBridgePersist;
  debug?: boolean;
}

export const createWebview = ({ bridge, host, debug }: CreateWebviewArgs) => {
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
      const {method, args, type} = JSON.parse(event.nativeEvent.data);

      switch(type) {
        case 'log':
          debug && handleLog(method, args);
          return;
        case 'bridge':
          webviewRef.current && handleBridge({
            bridge,
            method,
            args,
            webview: webviewRef.current,
          });
          return;
      }
    }}
    injectedJavaScriptBeforeContentLoaded={dedent`
      window.__bridgeSchema__ = [${bridgeNames}];
      
      true;
      `}
    injectedJavaScript={[console && CONSOLE_INTEGRATIONS_SCRIPTS, 'true;'].filter(Boolean).join('\n')}
    
    {...props} />
  };
};
