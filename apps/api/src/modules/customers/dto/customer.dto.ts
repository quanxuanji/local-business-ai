import {
  CustomerStatus,
  PreferredLanguage,
} from "@prisma/client";

export class CustomerOwnerDto {
  id!: string;
  name!: string;
  email!: string;
  role!: string;
}

export class CustomerDto {
  id!: string;
  workspaceId!: string;
  ownerId!: string | null;
  firstName!: string;
  lastName!: string | null;
  fullName!: string;
  email!: string | null;
  phone!: string | null;
  status!: CustomerStatus;
  preferredLanguage!: PreferredLanguage;
  source!: string | null;
  notes!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
  owner!: CustomerOwnerDto | null;
  appointmentsCount!: number;
}
