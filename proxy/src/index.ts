import dotenv from 'dotenv';
import http from 'http';
import { createProxyServer } from 'http-proxy';
import https from 'https';

import { extractHeader } from './utils/extract-header';
import { validateApiKey } from './utils/validate-api-key';

// init
dotenv.config();

const proxy = createProxyServer();

const server = http.createServer(async (req, res) => {
 try {
  const apiKey = extractHeader(req, res, "X-Proxy-API-Key");
  const target = extractHeader(req, res, "X-Proxy-Target");

  await validateApiKey(apiKey);

  const parsedUrl = new URL(target);
  const proxiedRequest: https.RequestOptions = {
   host: parsedUrl.host,
   path: `${parsedUrl.pathname}${parsedUrl.search}`,
   method: req.method,
   headers: { ...req.headers, host: parsedUrl.host },
  };

  delete proxiedRequest.headers!["accept-encoding"];

  https.request(proxiedRequest, (response) => response.pipe(res)).end();
 } catch (err) {
  if (err instanceof Error && err.cause === "CLIENT_BAD_REQUEST") {
   res.writeHead(403);
   res.end(err.message);
   return;
  }

  if (err instanceof Error && err.cause === "CLIENT_NOT_AUTHORIZED") {
   res.writeHead(403);
   res.end("Not authorized");
   return;
  }

  console.error(err);
  res.writeHead(500);
  res.end();
 }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
 console.log(`Proxy server started on port ${PORT}`);
});
