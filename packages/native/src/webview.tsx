import WebView, {type  WebViewProps } from 'react-native-webview';

export const createWebview = ({ ...props }: WebViewProps) => {
  return <WebView {...props} />;
};
