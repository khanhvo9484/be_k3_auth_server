const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')

const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const BundleAnalyzerPlugin =
	require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
	entry: ['webpack/hot/poll?100', './src/main.ts'],
	watch: true,
	target: 'node',
	externals: [
		nodeExternals({
			whitelist: ['webpack/hot/poll?100']
		})
	],
	module: {
		rules: [
			{
				test: /.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	mode: 'development',
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
		new ProgressBarPlugin({
			complete: '▰',
			incomplete: '▱',
			clear: false
		}),
		new BundleAnalyzerPlugin({
			analyzerMode: 'static',
			analyzerHost: '127.0.0.1',
			analyzerPort: '8888',
			reportFilename: process.env.NODE_ENV === 'development' && 'report.html',
			openAnalyzer: false,
			generateStatsFile: false,
			statsFilename: 'stats.json'
		}),
		new webpack.BannerPlugin({
			banner: 'require("source-map-support").install();',
			raw: true,
			entryOnly: false
		})
	],
	optimization: {
		removeAvailableModules: false,
		removeEmptyChunks: false,
		splitChunks: false
	},
	output: {
		pathinfo: false
		// path: path.join(__dirname, 'dist'),
		// filename: 'server.js'
	}
}
