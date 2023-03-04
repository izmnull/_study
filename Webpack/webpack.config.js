module.exports = (env, argv) => {
    const isDevMode = argv.mode === "development" ? true : false;
    const isStaging = !!env.STAGING;
    const isRelease = !!env.RELEASE;

    return {
        mode: isDevMode ? "development" : "production",
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
