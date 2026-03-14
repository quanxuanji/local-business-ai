import { Module } from "@nestjs/common";

import { HealthController } from "./health.controller";
import { AiModule } from "./modules/ai/ai.module";
import { AppointmentsModule } from "./modules/appointments/appointments.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { MessagingModule } from "./modules/messaging/messaging.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { WorkflowsModule } from "./modules/workflows/workflows.module";
import { WorkspaceModule } from "./modules/workspace/workspace.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    WorkspaceModule,
    CustomersModule,
    AppointmentsModule,
    MessagingModule,
    WorkflowsModule,
    ReviewsModule,
    AiModule,
    DashboardModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
