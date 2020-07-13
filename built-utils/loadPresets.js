const webpackMerge = require('webpack-merge');

module.exports = (presets) => {
    if (presets)
    {
        const presetsNames = [...[presets]];
        const mergedPresets = presetsNames.map(name => require(`./presets/webpack.${name}`)());
        return webpackMerge({}, ...mergedPresets);
    }
    return webpackMerge({}, {});
};