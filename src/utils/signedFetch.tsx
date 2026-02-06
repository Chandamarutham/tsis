import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { createSignedFetcher } from "aws-sigv4-fetch";

import { getenv } from "@utils/getenv";

const REGION = getenv("VITE_API_REGION");
const IDENTITY_POOL_ID = getenv("VITE_API_IDPOOL");

const credentials = fromCognitoIdentityPool({
  identityPoolId: IDENTITY_POOL_ID,
  clientConfig: {
    region: REGION,
  },
});

export const signedFetch = createSignedFetcher({
  region: REGION,
  service: "execute-api",
  credentials,
});
