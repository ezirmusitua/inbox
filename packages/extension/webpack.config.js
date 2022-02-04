const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "production",
    entry: {
        background: {
            import: "./lib/background/index.ts",
            filename: "background/[name].js"
        },
        content: {
            import: "./lib/content/index.ts",
            filename: "content/[name].js"
        },
        devtools: {
            import: "./lib/devtools/index.ts",
            filename: "devtools/[name].js"
        },
        newtab: {
            import: "./lib/newtab/index.tsx",
            filename: "newtab/[name].js"
        },
        options: {
            import: "./lib/options/index.tsx",
            filename: "options/[name].js"
        },
        panel: {
            import: "./lib/panel/index.tsx",
            filename: "panel/[name].js"
        },
        popup: {
            import: "./lib/popup/index.tsx",
            filename: "popup/[name].js"
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader", "postcss-loader"],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        modules: ['node_modules'],
        extensions: [".tsx", '.ts', '.js'],
        symlinks: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Kccount Devtools",
            chunks: ["devtools"],
            filename: "devtools/index.html"
        }),
        new HtmlWebpackPlugin({
            title: "Kccount Newtab",
            chunks: ["newtab"],
            template: "./lib/index.html",
            filename: "newtab/index.html"
        }),
        new HtmlWebpackPlugin({
            title: "Kccount Options",
            chunks: ["options"],
            template: "./lib/index.html",
            filename: "options/index.html"
        }),
        new HtmlWebpackPlugin({
            title: "Kccount Panel",
            chunks: ["panel"],
            template: "./lib/index.html",
            filename: "panel/index.html"
        }),
        new HtmlWebpackPlugin({
            title: "Kccount Popup",
            chunks: ["popup"],
            template: "./lib/index.html",
            filename: "popup/index.html"
        }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, "assets"), to: "assets", force: true },
                { from: path.resolve(__dirname, "manifest.json"), force: true },
            ]
        }),
    ],
    output: {
        path: path.resolve('/private_workspaces', 'inbox', 'extension', 'dist'),
        clean: true
    },
    devServer: {
        static: "/private_workspaces/inbox/extension/dist"
    },
    experiments: {
        asyncWebAssembly: true,
    },
}