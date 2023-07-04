const ALLOWED_DOMAINS = [
  'http://places.nomoreparties.sbs',
  'https://places.nomoreparties.sbs',
  'http://api.places.nomoreparties.sbs',
  'https://api.places.nomoreparties.sbs',
  'http://localhost:3000',
  'http://localhost:3001',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (ALLOWED_DOMAINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Credentials', true);

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);

    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.end();
  }

  return next();
};
