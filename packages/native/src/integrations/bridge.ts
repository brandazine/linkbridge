import WebView from 'react-native-webview';
import dedent from 'ts-dedent';

export type Procedure = (...args: any[]) => any;

export type ProceduresObject<T extends Record<string, Procedure>> = {
  [K in keyof T]: (
    ...args: Parameters<T[K]>
  ) => Promise<Awaited<ReturnType<T[K]>>>;
};

export type Bridge = <T extends Record<string, Procedure>>(
  procedures: T
) => ProceduresObject<T>;

export const bridge: Bridge = (procedures) => {
  console.log(procedures);
  return procedures;
};

type HandleBridgeArgs = {
  bridge: ProceduresObject<Record<string, Procedure>>;
  method: string;
  args?: any;
  webview: WebView;
  eventId: string;
};

export const handleBridge = async ({
  bridge,
  method,
  args,
  webview,
  eventId,
}: HandleBridgeArgs) => {
  const response = await bridge[method]?.(...args);

  webview.injectJavaScript(dedent`
    window.bridgeEmitter.emit('${method}-${eventId}',${JSON.stringify(
    response
  )});
  
    true;
  `);
};

export const INTEGRATIONS_SCRIPTS_BRIDGE = (bridgeNames: string) => dedent`
    window.__bridgeSchema__ = [${bridgeNames}];
`;
