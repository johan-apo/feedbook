import { Session } from "@auth0/nextjs-auth0";

/**
 * @description Gets the hexadecimal chunk of the auth0 id string from the Session
 * since MongoDB can't use the original auth0 id as a document id
 * @example
 * // from auth0|62d06b2fb624cf5ad886140b returns 62d06b2fb624cf5ad886140b
 * @param session - Auth0 session
 * @returns string userId
 */
const getUserIdFromAuth0 = (session: Session) =>
  getHexadecimalId(session.user.sub);

/**
 * @description Splits the string by its pipe symbol "|" and returns the second element
 * which is the hexadecimal id
 * @param auth0Id - Id coming from the Auth0 session
 */
const getHexadecimalId = (auth0Id: string) => auth0Id.split("|")[1];

function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

export { getUserIdFromAuth0, getHexadecimalId, hasOwnProperty };
