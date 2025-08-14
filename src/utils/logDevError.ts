export const logDevError = (error: unknown, context?: string) => {
  if (process.env.VERCEL_ENV !== "production") {
    console.error(`[ERROR] ${context ?? ""}`, error);
  }
};
