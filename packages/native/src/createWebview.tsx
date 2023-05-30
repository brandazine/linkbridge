import WebView, {type  WebViewProps } from 'react-native-webview';
import type { Procedure, ProceduresObject } from './integrations';
import { INTEGRATIONS_SCRIPTS_CONSOLE, INTEGRATIONS_SCRIPTS_BRIDGE, handleLog, handleBridge } from './integrations';
import { createRef } from 'react';

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
      const {method, args, type, eventId} = JSON.parse(event.nativeEvent.data);

      switch(type) {
        case 'log':
          debug && handleLog(method, args);
          return;
        case 'bridge':
          webviewRef.current && handleBridge({
            bridge,
            method,
            args,
            eventId,
            webview: webviewRef.current,
          });
          return;
      }
    }}
    injectedJavaScriptBeforeContentLoaded={[INTEGRATIONS_SCRIPTS_BRIDGE(bridgeNames), 'true;'].filter(Boolean).join('\n')}
    injectedJavaScript={[console && INTEGRATIONS_SCRIPTS_CONSOLE, 'true;'].filter(Boolean).join('\n')}
    
    {...props} />
  };
};
