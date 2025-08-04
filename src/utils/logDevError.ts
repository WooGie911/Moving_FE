export const logDevError = (error: unknown, context?: string) => {
  if (process.env.NEXT_PUBLIC_ENV !== "production") {
    console.error(`[ERROR] ${context ?? ""}`, error);
  }
};
