
# linkbridge
[![NPM](https://img.shields.io/npm/v/@linkbridge/native)](https://www.npmjs.com/package/@linkbridge/native)

DX-friendly webview interface to bridge with react-native and the web.  

Try registering a function in `bridge` in the react native code.  
Available directly on the web and `Type-Safe`.  

Inspired by `tRPC` and helps `react-native-webview` and `web` communicate.  
  
![linkbridge](https://github.com/brandazine/linkbridge/assets/41789633/a96ecd6a-eb6b-4dd8-9805-421ff6dca26c)

## Installation

- **React Native Project**

```sh
$ pnpm install @linkbridge/native react-native-webview # or yarn / npm
```

- **Web Project**

```sh
$ pnpm install @linkbridge/web # or yarn / npm
```

## Getting Started

* React Native 
```tsx
import {createWebview} from '@linkbridge/native';
import {bridge} from '@linkbridge/native';

export const appBridge = bridge({
  getMessage: () => {
    return "Hello, I'm native";
  },
  sum: (a: number,b: number) => {
    return a + b;
  },
  // ... Please write a react native function.
});

// Type to be exported to web.
export type AppBridge = typeof appBridge; 

export const {Webview} = createWebview({
  bridge: appBridge,
  host: 'http://localhost:5173', // webview host
  debug: true, // console.log is visible in native on the web.
});

// You can use the Webview that has been created.
function App(): JSX.Element {
  return (
    <SafeAreaView style={{height: '100%'}}>
      <Webview style={{height: '100%', width: '100%'}} />
    </SafeAreaView>
  );
}

export default App;
```

* Web
```tsx
import { createBridge } from "@linkbridge/web";
import type { AppBridge } from ""; // Type 'appBridge' declared by native must be imported.

const bridge = createBridge<AppBridge>();

bridge.getMessage().then(message => console.log(message); // expect "Hello, I'm native"
bridge.sum(1, 2).then(num => console.log(num); // expect 3
```

## Type Export Guide

A better way to use linkbridge is to export the type of `bride` declared in native to the web.
1. You can use `monorepo` to export the type of native `bridge`. **(recommend)**
2. You can use private npm registry to export the type of native `bridge`.
3. You can use tsc to build a bridge decaration file to move the file.  
   (Note. https://github.com/brandazine/linkbridge/blob/main/example/native/tsconfig.bridge.json)
   
## Contributor Guide
If you want a pull request for bugs or performance improvement, please check the following guide.  
[CONTRIBUTING.md](https://github.com/brandazine/linkbridge/blob/main/CONTRIBUTING.md)
