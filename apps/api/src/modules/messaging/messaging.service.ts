import { Injectable, NotFoundException } from "@nestjs/common";
import { MessageStatus, Prisma } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import type { CreateMessageDto } from "./dto/create-message.dto";
import type { ListMessagesQueryDto } from "./dto/list-messages-query.dto";
import type { MessageDto } from "./dto/message.dto";
import type {
  MessagingPlaceholderRequest,
  MessagingPlaceholderResult,
} from "./messaging.types";

const messageInclude = {
  customer: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    },
  },
} satisfies Prisma.MessageInclude;

@Injectable()
export class MessagingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    workspaceId: string,
    dto: CreateMessageDto,
  ): Promise<MessageDto> {
    const message = await this.prisma.message.create({
      data: {
        workspaceId,
        customerId: dto.customerId,
        appointmentId: dto.appointmentId,
        channel: dto.channel,
        status: dto.status ?? MessageStatus.DRAFT,
        subject: dto.subject,
        body: dto.body,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      },
      include: messageInclude,
    });
    return message as unknown as MessageDto;
  }

  async findAll(
    workspaceId: string,
    query: ListMessagesQueryDto,
  ): Promise<MessageDto[]> {
    const where: Prisma.MessageWhereInput = { workspaceId };
    if (query.customerId) where.customerId = query.customerId;
    if (query.channel) where.channel = query.channel;
    if (query.status) where.status = query.status;

    const messages = await this.prisma.message.findMany({
      where,
      include: messageInclude,
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return messages as unknown as MessageDto[];
  }

  async findOne(workspaceId: string, messageId: string): Promise<MessageDto> {
    const message = await this.prisma.message.findFirst({
      where: { id: messageId, workspaceId },
      include: messageInclude,
    });
    if (!message) throw new NotFoundException("Message not found");
    return message as unknown as MessageDto;
  }

  async send(workspaceId: string, messageId: string): Promise<MessageDto> {
    const message = await this.prisma.message.findFirst({
      where: { id: messageId, workspaceId },
    });
    if (!message) throw new NotFoundException("Message not found");

    if (message.status !== MessageStatus.DRAFT) {
      throw new NotFoundException("Only DRAFT messages can be sent");
    }

    const updated = await this.prisma.message.update({
      where: { id: messageId },
      data: {
        status: MessageStatus.SENT,
        sentAt: new Date(),
        providerMessageId: `sim_${Date.now()}`,
      },
      include: messageInclude,
    });
    return updated as unknown as MessageDto;
  }

  async remove(
    workspaceId: string,
    messageId: string,
  ): Promise<{ id: string; deleted: boolean }> {
    const message = await this.prisma.message.findFirst({
      where: { id: messageId, workspaceId },
    });
    if (!message) throw new NotFoundException("Message not found");

    await this.prisma.message.delete({ where: { id: messageId } });
    return { id: messageId, deleted: true };
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
