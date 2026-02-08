import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { createSignedFetcher } from "aws-sigv4-fetch";
import { getenv } from "@utils/getenv";

const REGION = getenv("VITE_API_REGION");
const IDENTITY_POOL_ID = getenv("VITE_API_IDPOOL");

let signedFetch: ReturnType<typeof createSignedFetcher> | null = null;

export async function initSignedFetch() {
  const credentialProvider = fromCognitoIdentityPool({
    identityPoolId: IDENTITY_POOL_ID,
    clientConfig: { region: REGION },
  });

  signedFetch = createSignedFetcher({
    region: REGION,
    service: "execute-api",
    credentials: credentialProvider,
  });
}

export function getSignedFetch() {
  if (!signedFetch) {
    throw new Error(
      "signedFetch is not initialized. Call initSignedFetch() once during app startup."
    );
  }
  return signedFetch;
}
