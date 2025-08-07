import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import dotenv from 'dotenv';

// 解决 __dirname 在 ES 模块中的问题
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, '.env.development') });

// 获取 API 基础 URL
const apiBase = process.env.REACT_APP_API_BASE || 'http://localhost:80';

export default {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'build'),
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
        // 注入环境变量到前端代码
        new webpack.DefinePlugin({
            'window.API_BASE': JSON.stringify(apiBase),
            'process.env': JSON.stringify(process.env)
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 3000,
        historyApiFallback: {
            disableDotRule: true,
            index: '/',
        },
        proxy: {
            '/api': {
                target: apiBase,
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
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
};