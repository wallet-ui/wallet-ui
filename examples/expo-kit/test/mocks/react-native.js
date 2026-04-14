const React = require('react');

module.exports = {
    Button: ({ disabled, onPress, title }) => React.createElement('Button', { disabled, onPress, title }, title),
    StyleSheet: {
        create: styles => styles,
    },
    Text: ({ children, ...props }) => React.createElement('Text', props, children),
    View: ({ children, ...props }) => React.createElement('View', props, children),
};
