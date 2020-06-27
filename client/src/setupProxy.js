const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (test) {
  // console.log('app : ', test);
  // console.log('module.children: ', module.children);
  // console.log('createProxyMiddleware : ', createProxyMiddleware);
  // console.log('module.exports: ', module.exports);

  test.use(createProxyMiddleware('/api', { target: 'http://localhost:5000' }));
};

// lorsqu'écrit sans module.exports app est undefined, peut être que module.exports donne le context, c-à-d que puisque
// require dans ce module package http-proxy-middleware ALORS il "compose" ce module, et ce module serait implémenter avec une fonction dont argumet
// serait app et connecté à node sans qu'on est à le spécifié
