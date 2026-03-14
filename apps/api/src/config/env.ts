const fallbackPort = 4000;

function toNumber(value: string | undefined, defaultValue: number): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : defaultValue;
}

export const env = {
  port: toNumber(process.env.PORT, fallbackPort),
  databaseUrl: process.env.DATABASE_URL ?? "",
  frontendUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET ?? "change-me",
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID ?? "",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  openAiApiKey: process.env.OPENAI_API_KEY ?? "",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  redisUrl: process.env.REDIS_URL ?? "",
  bullmqPrefix: process.env.BULLMQ_PREFIX ?? "local-business-ai",
};
