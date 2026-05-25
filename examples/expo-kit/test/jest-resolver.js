module.exports = (request, options) => {
    try {
        return options.defaultResolver(request, options);
    } catch (error) {
        try {
            return require.resolve(request, { paths: [options.basedir] });
        } catch {
            throw error;
        }
    }
};
