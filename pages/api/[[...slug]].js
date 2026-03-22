const stubHandler = require('../../../local-stub-api');

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

export default function handler(req, res) {
  const originalUrl = req.url || '/';
  req.url = originalUrl.replace(/^\/api(?=\/|$)/, '') || '/';
  return stubHandler(req, res);
}
