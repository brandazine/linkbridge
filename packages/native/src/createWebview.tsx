import WebView, {type  WebViewProps } from 'react-native-webview';
import type { Procedure, ProceduresObject } from './integrations';
import { INTEGRATIONS_SCRIPTS_CONSOLE, INTEGRATIONS_SCRIPTS_BRIDGE, handleLog, handleBridge } from './integrations';
import { useMemo, useRef } from 'react';

interface CreateWebviewArgs {
  bridge: ProceduresObject<Record<string, Procedure>>;
  host: string;
  debug?: boolean;
}

export const createWebview = ({ bridge, host, debug }: CreateWebviewArgs) => {
  return {
    Webview: (props: Omit<WebViewProps, 'source'>) => {
      const webviewRef = useRef<WebView>(null);

      const bridgeNames = useMemo(() => Object.values(bridge ?? {})
        .map((func) => {
          return `'${func.name}'`;
        })
        .join(), [bridge]);

        
      return <WebView 
                ref={webviewRef}
                source={{ uri: host }}
                onMessage={async (event) => {
                  props.onMessage?.(event);
                  
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
                injectedJavaScriptBeforeContentLoaded={
                  [INTEGRATIONS_SCRIPTS_BRIDGE(bridgeNames), props.injectedJavaScriptBeforeContentLoaded, 'true;'].filter(Boolean).join('\n')
                }
                injectedJavaScript={
                  [console && INTEGRATIONS_SCRIPTS_CONSOLE, props.injectedJavaScript, 'true;'].filter(Boolean).join('\n')
                }
                {...props} />
      }
  };
};
