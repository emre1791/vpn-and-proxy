import assert from 'assert';

import { getCloudSecret } from './get-cloud-secret';

export async function validateApiKey(givenKey: string) {
 const secretName = process.env["GCP_TOKEN_SECRET_ID"];
 assert(secretName, "GCP_TOKEN_SECRET_ID is not set");

 const storedKey = await getCloudSecret(secretName);
 assert(storedKey, "secret is not set");

 if (givenKey !== storedKey) {
  throw new Error("Invalid API key", { cause: "CLIENT_NOT_AUTHORIZED" });
 }
}
