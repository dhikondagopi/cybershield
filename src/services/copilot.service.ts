import { apiClient } from "@/api/client";
import type { CopilotChatPayload, CopilotMessage, ReportRequest, ReportResponse } from "@/types";

export const copilotService = {
  chat: (payload: CopilotChatPayload) =>
    apiClient.post<CopilotMessage>("/copilot/chat", payload).then((r) => r.data),
  analyzeLogs: (logs: string) =>
    apiClient.post<{ summary: string; findings: Array<{ severity: string; detail: string }> }>(
      "/copilot/log-analysis",
      { logs },
    ).then((r) => r.data),
  generateReport: (payload: ReportRequest) =>
    apiClient.post<ReportResponse>("/copilot/report", payload).then((r) => r.data),
  threatAnalysis: (input: Record<string, unknown>) =>
    apiClient.post<{ actor: string; confidence: number; techniques: string[]; narrative: string }>(
      "/copilot/threat-analysis",
      input,
    ).then((r) => r.data),

  async *streamChat(payload: CopilotChatPayload): AsyncGenerator<string, void, unknown> {
    const full = await copilotService.chat(payload);
    const text = full.content;
    const chunkSize = Math.max(4, Math.floor(text.length / 40));
    for (let i = 0; i < text.length; i += chunkSize) {
      yield text.slice(i, i + chunkSize);
      await new Promise((r) => setTimeout(r, 25));
    }
  },
};
