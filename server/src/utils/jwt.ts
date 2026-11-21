import jwt from "jsonwebtoken";

export type TokenPayload = { userId: string };

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return secret;
};

export const signToken = (payload: TokenPayload) => jwt.sign(payload, getSecret(), { expiresIn: "7d" });

export const verifyToken = (token: string): TokenPayload => jwt.verify(token, getSecret()) as TokenPayload;
