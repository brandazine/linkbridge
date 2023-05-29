import dedent from 'ts-dedent';

export const CONSOLE_INTEGRATIONS_SCRIPTS = dedent`
{
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  console.log = function() {
    var message = Array.from(arguments).join(' ');
    window.ReactNativeWebView.postMessage(JSON.stringify({ logType: 'log', message }));
    originalConsoleLog.apply(console, arguments);
  };

  console.error = function() {
    var message = Array.from(arguments).join(' ');
    window.ReactNativeWebView.postMessage(JSON.stringify({ logType: 'error', message }));
    originalConsoleError.apply(console, arguments);
  };

  console.warn = function() {
    var message = Array.from(arguments).join(' ');
    window.ReactNativeWebView.postMessage(JSON.stringify({ logType: 'warn', message }));
    originalConsoleWarn.apply(console, arguments);
  };
};

true;
`;

export const handleLog = (logType: 'log' | 'error' | 'warn', message?: any) => {
  switch (logType) {
    case 'log': {
      console.log('(Webview)', message);
      break;
    }
    case 'error': {
      console.error('(Webview)', message);
      break;
    }
    case 'warn': {
      console.warn('(Webview)', message);
      break;
    }
  }
};
