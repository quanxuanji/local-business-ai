import {
  MessageChannel,
  MessageDirection,
  MessageStatus,
} from "@prisma/client";

export class MessageCustomerDto {
  id!: string;
  firstName!: string;
  lastName!: string | null;
  fullName!: string;
  email!: string | null;
  phone!: string | null;
}

export class MessageDto {
  id!: string;
  workspaceId!: string;
  customerId!: string;
  appointmentId!: string | null;
  channel!: MessageChannel;
  direction!: MessageDirection;
  status!: MessageStatus;
  subject!: string | null;
  body!: string;
  providerMessageId!: string | null;
  scheduledAt!: Date | null;
  sentAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
  customer!: MessageCustomerDto;
}
