import "server-only";

import {
  getTelegramBotToken,
  getTelegramChannelId,
  hasTelegramConfig,
} from "@/lib/telegram/telegram-config";

type SendTelegramMessageResult = {
  messageId: string;
};

type TelegramSendMessageResponse =
  | {
      ok: true;
      result: {
        message_id: number;
      };
    }
  | {
      ok: false;
      description?: string;
      error_code?: number;
    };

export class TelegramConfigurationError extends Error {
  constructor() {
    super("Telegram is not configured. Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID.");
    this.name = "TelegramConfigurationError";
  }
}

export async function sendTelegramMessage(
  text: string,
): Promise<SendTelegramMessageResult> {
  if (!hasTelegramConfig()) {
    throw new TelegramConfigurationError();
  }

  const response = await fetch(
    `https://api.telegram.org/bot${getTelegramBotToken()}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: getTelegramChannelId(),
        text,
      }),
    },
  );
  const data = (await response.json().catch(() => null)) as
    | TelegramSendMessageResponse
    | null;

  if (!response.ok || !data?.ok) {
    const description =
      data && "description" in data
        ? data.description
        : "Telegram Bot API request failed.";

    throw new Error(description ?? "Telegram Bot API request failed.");
  }

  return {
    messageId: String(data.result.message_id),
  };
}
