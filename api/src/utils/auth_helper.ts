import { sign, decode } from 'jsonwebtoken';
import 'dotenv/config';

/**
 * Represents the claims of an authentication token.
 */
export interface Payload {
  userId: string;
  iat: number;
  exp: number;
}

/**
 * Decodes an authentication token.
 */
export function DecodeAuthToken(token: string): Payload {
  return decode(token) as Payload;
}

/**
 * Encodes claims for user authentication.
 */
export function EncodeAuthClaims(userId: string): string {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
  return sign({ userId, exp }, process.env.JWT_SECRET);
}
