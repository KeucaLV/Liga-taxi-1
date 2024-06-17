// webpack.config.js
module.exports = {
    // ... other config settings ...
    resolve: {
        fallback: {
            "https": require.resolve("https-browserify"),
            "querystring": require.resolve("querystring-es3")
        }
    }
};
