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
  return sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
}
