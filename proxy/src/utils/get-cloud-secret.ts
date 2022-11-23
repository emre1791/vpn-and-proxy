import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import assert from "node:assert";

const client = new SecretManagerServiceClient();

export async function getCloudSecret(secretName: string): Promise<string> {
	const [version] = await client.accessSecretVersion({
		name: `projects/${process.env.GCP_PROJECT_ID}/secrets/${secretName}/versions/latest`,
	});

	// CODEANYWHERE.COM

	assert(version.payload, "No secret payload found");
	assert(version.payload.data, "No secret data found");

	const payload = version.payload.data.toString();
	return payload;
}
