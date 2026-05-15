const React = require('react');

const NextLinkMock = React.forwardRef(function NextLinkMock(props, ref) {
  const { children, href = '', ...rest } = props;
  const resolvedHref = typeof href === 'string' ? href : href?.pathname || '';

  return React.createElement(
    'a',
    {
      href: resolvedHref,
      ref,
      ...rest,
    },
    children,
  );
});

module.exports = NextLinkMock;
