const {getDefaultConfig} = require('metro-config');
const {makeMetroConfig} = require('@rnx-kit/metro-config');
const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks');
const path = require('path');

module.exports = (async () => {
  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig();

  const config = makeMetroConfig({
    projectRoot: path.resolve(__dirname),
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
      resolveRequest: MetroSymlinksResolver(),
      useWatchman: false,
    },
  });
  return config;
})();
