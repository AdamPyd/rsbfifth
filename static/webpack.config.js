const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, '../app/src/main/resources/static'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 3000,
        historyApiFallback: {
            disableDotRule: true, // 添加此配置
            index: '/',           // 确保指定索引文件
        },
        proxy: {
            '/api': {
                target: import.meta.env.REACT_APP_API_BASE || 'http://localhost:80',
                changeOrigin: true,
                pathRewrite: { '^/api': '' },
                secure: false
            }
        },
        onBeforeSetupMiddleware: (devServer) => {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }

            // 处理特殊字符编码问题
            devServer.app.use((req, res, next) => {
                try {
                    decodeURIComponent(req.path);
                    next();
                } catch (err) {
                    // 处理无效 URI
                    res.status(400).send('Invalid URI');
                }
            });
        }
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx']
    }
};