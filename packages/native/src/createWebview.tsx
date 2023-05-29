import WebView, {type  WebViewProps } from 'react-native-webview';
import type { Procedure, ProceduresObject } from './bridge';
import { createRef } from 'react';
import dedent from "ts-dedent";
import { CONSOLE_INTEGRATIONS_SCRIPTS, handleLog } from './integrations';

type LinkBridgePersist = {
  localStorage: string[]
}

interface CreateWebviewArgs {
  bridge: ProceduresObject<Record<string, Procedure>>;
  host: string;
  persist?: LinkBridgePersist;
  console?: boolean;
}

export const createWebview = ({ bridge, host, console }: CreateWebviewArgs) => {
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
      const {method , args, logType, message} = JSON.parse(event.nativeEvent.data);

      if(console && logType) {
        handleLog(logType,message);
        return;
      }

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
    injectedJavaScript={[console && CONSOLE_INTEGRATIONS_SCRIPTS].filter(Boolean).join('\n')}
    
    {...props} />
  };
};
