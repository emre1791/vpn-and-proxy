import dotenv from 'dotenv';
import http from 'http';
import { createProxyServer } from 'http-proxy';

import { extractHeader } from './utils/extract-header';
import { validateApiKey } from './utils/validate-api-key';

// init
dotenv.config();

const proxy = createProxyServer();

const server = http.createServer(async (req, res) => {
 try {
  const target = extractHeader(req, res, "X-Proxy-Target");
  const apiKey = extractHeader(req, res, "X-Proxy-API-Key");

  await validateApiKey(apiKey);

  delete req.headers["host"];

  proxy.web(req, res, { target, ignorePath: true });
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
