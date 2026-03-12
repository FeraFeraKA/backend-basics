import { config } from "../../shared/config/env.js";
import { signAccessToken, signRefreshToken } from "../../shared/lib/jwt.js";

export function issueTokens(user: { id: string; email: string }) {
  const payload = {
    sub: user.id,
    email: user.email,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const refreshExpiresAt = new Date(
    Date.now() + config.jwtRefreshExpiresIn * 1000,
  );

  return { accessToken, refreshToken, refreshExpiresAt };
}
