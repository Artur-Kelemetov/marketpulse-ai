import "server-only";

import { sqlite } from "@/db/client";
import { getOpenAIModelName, hasOpenAIConfig } from "@/lib/ai/openai-config";
import { hasTelegramConfig } from "@/lib/telegram/telegram-config";

export type IntegrationStatus = "ok" | "missing" | "error";

export type SystemStatus = {
  database: {
    status: IntegrationStatus;
    label: string;
    detail: string;
  };
  openai: {
    status: IntegrationStatus;
    label: string;
    detail: string;
    model: string;
  };
  telegram: {
    status: IntegrationStatus;
    label: string;
    detail: string;
  };
};

export function getSystemStatus(): SystemStatus {
  return {
    database: getDatabaseStatus(),
    openai: getOpenAIStatus(),
    telegram: getTelegramStatus(),
  };
}

function getDatabaseStatus(): SystemStatus["database"] {
  try {
    sqlite.prepare("select 1 as ok").get();

    return {
      status: "ok",
      label: "SQLite connected",
      detail: "Local database is reachable.",
    };
  } catch (error) {
    return {
      status: "error",
      label: "SQLite error",
      detail: error instanceof Error ? error.message : "Database check failed.",
    };
  }
}

function getOpenAIStatus(): SystemStatus["openai"] {
  const model = getOpenAIModelName();

  if (!hasOpenAIConfig()) {
    return {
      status: "missing",
      label: "OpenAI key missing",
      detail: "Add OPENAI_API_KEY to .env.local to enable real AI generation.",
      model,
    };
  }

  return {
    status: "ok",
    label: "OpenAI configured",
    detail: "AI routes can use the configured OpenAI model.",
    model,
  };
}

function getTelegramStatus(): SystemStatus["telegram"] {
  if (!hasTelegramConfig()) {
    return {
      status: "missing",
      label: "Telegram missing",
      detail: "Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID to publish messages.",
    };
  }

  return {
    status: "ok",
    label: "Telegram configured",
    detail: "Telegram publish route can send messages through Bot API.",
  };
}