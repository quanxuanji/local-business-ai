import { MessageChannel, ReviewStatus } from "@prisma/client";

export class ReviewCustomerDto {
  id!: string;
  firstName!: string;
  lastName!: string | null;
  fullName!: string;
  email!: string | null;
  phone!: string | null;
}

export class ReviewDto {
  id!: string;
  workspaceId!: string;
  customerId!: string;
  appointmentId!: string | null;
  status!: ReviewStatus;
  channel!: MessageChannel;
  rating!: number | null;
  comment!: string | null;
  externalUrl!: string | null;
  requestedAt!: Date | null;
  submittedAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
  customer!: ReviewCustomerDto;
}
