export function getTelegramBotToken() {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() ?? "";
}

export function getTelegramChannelId() {
  return process.env.TELEGRAM_CHANNEL_ID?.trim() ?? "";
}

export function hasTelegramConfig() {
  const token = getTelegramBotToken();
  const channelId = getTelegramChannelId();

  return Boolean(
    token &&
      channelId &&
      token !== "replace_me_later" &&
      channelId !== "replace_me_later",
  );
}
