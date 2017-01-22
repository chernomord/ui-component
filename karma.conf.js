module.exports = function (config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            {pattern: "src/**/*.ts"}, // *.tsx for React Jsx
        ],
        preprocessors: {
            "**/*.ts": ["karma-typescript"], // *.tsx for React Jsx
        },
        reporters: ["spec", "karma-typescript"],
        browsers: ["PhantomJS"]
    });
};