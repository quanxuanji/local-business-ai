import { Injectable } from "@nestjs/common";

import type { ModuleOverviewDto } from "../../common/dto/module-overview.dto";
import type {
  MessagingPlaceholderRequest,
  MessagingPlaceholderResult,
} from "./messaging.types";

@Injectable()
export class MessagingService {
  getOverview(): ModuleOverviewDto {
    return {
      module: "messaging",
      phase: 1,
      summary:
        "Minimal outbound messaging placeholder that can receive AI-generated drafts before any real provider is introduced.",
      nextSteps: [
        "Replace placeholder delivery with Twilio or Resend adapters when needed",
        "Keep approval-oriented draft states as the default workflow handoff",
      ],
      futureExtensions: [
        "Additional outbound channels can reuse the same placeholder contract",
      ],
    };
  }

  createPlaceholder(
    request: MessagingPlaceholderRequest,
  ): MessagingPlaceholderResult {
    return {
      id: `msg_${Date.now()}`,
      status:
        request.deliveryMode === "simulate_send" ? "simulated_send" : "draft",
      provider: "placeholder",
      channel: request.channel,
      body: request.body,
      recipient: request.recipient,
    };
  }
}
