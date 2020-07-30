const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

const DEMO = path.join(__dirname, "demo");
const OUTPUT = path.join(__dirname, "build");

module.exports = {
	mode: "development",
	entry: path.join(DEMO, "index.ts"),
	output: {
		filename: "index.js",
		path: OUTPUT,
	},
	resolve: {
		extensions: [".ts", ".js", ".vue"],
		modules: [DEMO, "node_modules"],
		alias: {
			"@": path.join(__dirname, "source"),
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(DEMO, "index.html"),
			path: OUTPUT,
			filename: "index.html",
		}),
		new VueLoaderPlugin(),
	],
	devServer: {
		port: 8081,
		open: "Chrome",
		contentBase: OUTPUT,
		historyApiFallback: true,
		proxy: {
			"/": "http://localhost:8081/index.html",
		},
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
			},
			{
				test: /\.ts/,
				exclude: /node_modules/,
				loader: "ts-loader",
				options: {
					appendTsSuffixTo: [/\.vue$/],
				},
			},
			{
				test: /\.less/,
				loader: "style-loader!css-loader!less-loader",
			},
			{
				test: /\.css/,
				loader: "style-loader!css-loader",
			},
		],
	},
};
