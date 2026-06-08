export const ADMIN_SESSION_COOKIE = "marketpulse_admin_session";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

export function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() ?? "";
}

export function hasAdminAuthConfig() {
  const password = getAdminPassword();
  const sessionSecret = getAdminSessionSecret();

  return Boolean(
    password &&
      sessionSecret &&
      password !== "replace_me_later" &&
      sessionSecret !== "replace_me_later",
  );
}

export function isValidAdminSession(value: string | undefined) {
  return Boolean(
    value && hasAdminAuthConfig() && value === getAdminSessionSecret(),
  );
}