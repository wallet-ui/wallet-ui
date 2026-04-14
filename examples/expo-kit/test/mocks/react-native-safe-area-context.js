const React = require('react');

module.exports = {
    SafeAreaView: ({ children, ...props }) => React.createElement('SafeAreaView', props, children),
};
