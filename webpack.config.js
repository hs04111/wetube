const path = require('path');

// __dirname은 현재 디렉토리의 주소를 보여준다
// path.resolve(__dirname)는 뒤에 ,로 이어진 경로를 합쳐준다.

module.exports = {
    entry: './src/client/js/main.js', // 바꾸고 싶은 최신문법의 javascript
    mode: 'development', // 개발로 모드를 설정하면 변환된 코드가 읽기 쉬운 편. 나중에는 생산 모드로 바꿔야 할 것.
    output: {
        // 변환된 호환성 좋은 javascript를 둘 곳
        filename: 'main.js',
        path: path.resolve(__dirname, 'assets', 'js')
    },
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
            }
        ]
    }
};

// 이 과정은 프론트엔드, 브라우저에서 사용될 코드를 전환하는 것.
// 백엔드는 Babel을 사용중이다. 이를 프론트엔드로 가져오는 것이 bable-loader
// 자세한 module 설정은 https://github.com/babel/babel-loader

// /\.js$/ = RegExp 정규표션식
// 정규표현식에선 .가 분류 커맨드이므로 그냥 .을 쓸려면 \.을 해줘야 된다.
// 따라서 \.js는 .js이다
