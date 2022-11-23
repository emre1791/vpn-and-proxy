import { IncomingMessage, OutgoingMessage } from 'http';

export function extractHeader(
 req: IncomingMessage,
 res: OutgoingMessage,
 header: string
) {
 const key = header.toLowerCase();
 const value = req.headers[key];

 if (typeof value !== "string") {
  throw new Error(`No ${header} header specified`, {
   cause: "CLIENT_BAD_REQUEST",
  });
 }

 delete req.headers[key];

 return value;
}
