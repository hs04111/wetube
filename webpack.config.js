const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// __dirname은 현재 디렉토리의 주소를 보여준다
// path.resolve(__dirname)는 뒤에 ,로 이어진 경로를 합쳐준다.

module.exports = {
    entry: {
        main: './src/client/js/main.js',
        videoPlayer: './src/client/js/videoPlayer.js'
    }, // 바꾸고 싶은 최신문법의 javascript
    mode: 'development', // 개발로 모드를 설정하면 변환된 코드가 읽기 쉬운 편. 나중에는 생산 모드로 바꿔야 할 것.
    watch: true, // true면 webpack이 항상 변화를 감지하여 변환한다.
    output: {
        // 변환된 호환성 좋은 javascript를 둘 곳
        filename: 'js/[name].js', // [name]은 entry의 key값을 가져다가 쓴다.
        path: path.resolve(__dirname, 'assets'),
        clean: true // webpack을 재시작하면 기존 파일을 지운다.
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/styles.css' // css 폴더를 따로 생성하는 filename
        })
    ],
    module: {
        // rules는 array로, 어떤 것들을 어떤 방식으로 변환할 것인지 설정한다.
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: 'defaults' }]
                        ]
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] // 순서는 역순
            }
        ]
    }
};

// 이 과정은 프론트엔드, 브라우저에서 사용될 코드를 전환하는 것.
// 백엔드의 자바스크립트는는 Babel을 사용중이다. 이를 프론트엔드로 가져오는 것이 bable-loader
// 자세한 module 설정은 https://github.com/babel/babel-loader

// /\.js$/ = RegExp 정규표션식
// 정규표현식에선 .가 분류 커맨드이므로 그냥 .을 쓸려면 \.을 해줘야 된다.
// 따라서 \.js는 .js이다

// css는 아래와 같은 3개의 loader가 필요하다. 각 loader를 구글링하여 설치한다.
// sass-loader: Loads a Sass/SCSS file and compiles it to CSS.
// css-loader: The css-loader interprets @import and url() like import/require() and will resolve them.
// style-loader: Inject CSS into the DOM

// style-loader를 MiniCssExtractPlugin으로 대체했다.
// style-loader는 자바스크립트가 css를 추가하는 형식으로, 자바스크립트가 로드되기를 기다려야 한다.
// MiniCssExtractPlugin는 css를 따로 분리시켜주는 역할을 한다.
