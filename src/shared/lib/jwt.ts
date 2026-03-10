import jwt from "jsonwebtoken";

type JwtPayload = {
  sub: string;
  email: string;
};

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: +process.env.JWT_EXPIRES_IN!,
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
}
