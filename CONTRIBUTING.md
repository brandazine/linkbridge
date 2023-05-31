# Contibutor Guide
We are developing using pnpm. Please use pnpm.
Examples can be found in the `example` folder. You must run `example/native` and `example/web` at the same time.
## Setup

```sh
$ pnpm i
$ pnpm build
```
## React Native (iOS) Start

```sh
$ cd example/native
$ pnpx pod-install
$ pnpm ios
$ pnpm extract-type --watch
```
## Web Start

```sh
$ cd example/web
$ pnpm dev
```
