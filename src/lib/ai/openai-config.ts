export function getOpenAIApiKey() {
  return process.env.OPENAI_API_KEY?.trim() ?? "";
}

export function hasOpenAIConfig() {
  const apiKey = getOpenAIApiKey();

  return Boolean(apiKey && apiKey !== "replace_me_later");
}

export function getOpenAIModelName() {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini";
}