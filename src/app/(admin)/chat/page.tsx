import { PageHeader } from "@/components/layout/PageHeader";

import { ChatPanel } from "./chat-panel";

export default function ChatPage() {
  return (
    <>
      <PageHeader
        title="AI Chat"
        description="Ask quick research questions, refine ideas, and discuss publication safety with the MarketPulse AI assistant."
      />

      <main className="px-6 py-6">
        <ChatPanel />
      </main>
    </>
  );
}
