module.exports = {
    plugins: [
        require('postcss-preset-env')(),
        require('postcss-nested')()
    ]
};
//конфиг для postcss (позволяет делать вложенность в css)