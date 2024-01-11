const path = require('path')
const nodeExternals = require('webpack-node-externals')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
module.exports = function (options) {
	return {
		...options,
		mode: 'production',
		entry: options.entry,
		externals: [
			nodeExternals({
				// Add an allowlist for modules that should be bundled
				allowlist: []
			})
		],
		output: {
			filename: 'bundle.js',
			path: path.resolve(__dirname, 'dist')
			// Other output options...
		},
		optimization: {
			minimizer: [new TerserWebpackPlugin()]
		},
		plugins: [
			...options.plugins,
			new CompressionWebpackPlugin(),
			// Other plugins...
			new ForkTsCheckerWebpackPlugin({
				typescript: {
					memoryLimit: 4096
				}
			})
		]
	}
}
