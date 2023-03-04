module.exports = (env, argv) => {
    return {
        mode: "development",
        target: ["web", "es5"],
        entry: {
            common: "./src/script/common.js"
        },
        output: {
            filename: "./common/js/common.js"
        },
        watchOptions: {
            ignored: "**/node_modules"
        },
        module: {},
        plugins: []
    };
};
