const isProduction = process.env.NODE_ENV === "production";

function normalizeEnvValue(value: string | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function getEnvVarOrDefault(
  name: string,
  defaultValue: string,
): string {
  const normalized = normalizeEnvValue(process.env[name]);

  if (normalized) {
    return normalized;
  }

  if (isProduction) {
    throw new Error(
      `${name} must be defined in production environments.`,
    );
  }

  return defaultValue;
}

export function getRequiredEnvVar(name: string): string {
  const normalized = normalizeEnvValue(process.env[name]);

  if (normalized) {
    return normalized;
  }

  throw new Error(`${name} must be defined.`);
}
