import { Session } from "@auth0/nextjs-auth0";

/**
 * @param auth0id - Id coming from the Auth0 session
 */
const getHexadecimalId = (auth0id: string) => auth0id.split("|")[1];

/**
 * @param session - Auth0 session
 */
const getUserIdFromAuth0 = (session: Session) =>
  getHexadecimalId(session.user.sub);

export { getUserIdFromAuth0, getHexadecimalId };
