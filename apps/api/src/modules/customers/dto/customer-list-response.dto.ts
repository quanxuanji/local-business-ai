import { CustomerStatus } from "@prisma/client";

import { CustomerDto } from "./customer.dto";
import {
  CustomerListSortBy,
  CustomerListSortOrder,
} from "./list-customers-query.dto";

export class CustomerListPaginationDto {
  page!: number;
  limit!: number;
  total!: number;
  pages!: number;
  hasNextPage!: boolean;
  hasPreviousPage!: boolean;
}

export class CustomerListFiltersDto {
  search!: string | null;
  ownerId!: string | null;
  status!: CustomerStatus | null;
  sortBy!: CustomerListSortBy;
  sortOrder!: CustomerListSortOrder;
}

export class CustomerListStatusCountsDto {
  NEW_LEAD!: number;
  CONTACTED!: number;
  BOOKED!: number;
  ACTIVE!: number;
  INACTIVE!: number;
  LOST!: number;
}

export class CustomerListSummaryDto {
  total!: number;
  returned!: number;
  countsByStatus!: CustomerListStatusCountsDto;
}

export class CustomerListResponseDto {
  items!: CustomerDto[];
  pagination!: CustomerListPaginationDto;
  filters!: CustomerListFiltersDto;
  summary!: CustomerListSummaryDto;
}
