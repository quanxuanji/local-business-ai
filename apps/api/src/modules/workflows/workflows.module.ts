import { Module } from "@nestjs/common";

import { AiModule } from "../ai/ai.module";
import { MessagingModule } from "../messaging/messaging.module";
import { WorkflowsController } from "./workflows.controller";
import { WorkflowRuleExecutor } from "./workflow-rule.executor";
import { WorkflowsService } from "./workflows.service";

@Module({
  imports: [AiModule, MessagingModule],
  controllers: [WorkflowsController],
  providers: [WorkflowsService, WorkflowRuleExecutor],
})
export class WorkflowsModule {}
