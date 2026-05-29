import { AuthConfig } from 'convex/server';

const clientId = process.env.WORKOS_CLIENT_ID;

export default {
  providers: [
    {
      type: 'customJwt',
      issuer: 'https://api.workos.com/',
      algorithm: 'RS256',
      jwks: `https://api.workos.com/sso/jwks/client_01KSQRTK12DAMFR484E88YYP74`,
      applicationID: "client_01KSQRTK12DAMFR484E88YYP74",
    },
    {
      type: 'customJwt',
      issuer: `https://api.workos.com/user_management/client_01KSQRTK12DAMFR484E88YYP74`,
      algorithm: 'RS256',
      jwks: `https://api.workos.com/sso/jwks/client_01KSQRTK12DAMFR484E88YYP74`,
    },
  ],
} satisfies AuthConfig;
