export function hasOpenAIConfig() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function getOpenAIModelName() {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini";
}
