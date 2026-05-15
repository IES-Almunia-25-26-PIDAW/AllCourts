const React = require('react');

function NextImageMock(props) {
  const { alt = '', priority, src, ...rest } = props;
  const resolvedSrc = typeof src === 'string' ? src : src?.src || '';

  return React.createElement('img', {
    alt,
    src: resolvedSrc,
    ...rest,
  });
}

module.exports = NextImageMock;
