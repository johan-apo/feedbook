import { expressjwt as jwt, GetVerificationKey } from "express-jwt";
import { expressJwtSecret } from "jwks-rsa";
import { promisify } from "util";

const jwtCheck = promisify(
  jwt({
    secret: expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${process.env.AUTH0_ISSUER_BASE_URL}.well-known/jwks.json`,
    }) as GetVerificationKey,
    audience: process.env.AUTH0_AUDIENCE,
    issuer: process.env.AUTH0_ISSUER_BASE_URL,
    algorithms: ["RS256"],
  })
);

export default jwtCheck;
