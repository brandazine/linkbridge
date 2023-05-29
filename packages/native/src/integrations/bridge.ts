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
};

export const handleBridge = async ({
  bridge,
  method,
  args,
  webview,
}: HandleBridgeArgs) => {
  const response = await bridge[method]?.(...args);

  webview.injectJavaScript(dedent`
    window.bridgeEmitter.emit('${method}',${JSON.stringify(response)});
  
    true;
  `);
};
