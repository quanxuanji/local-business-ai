import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Prisma, type CustomerStatus, type PreferredLanguage } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { CustomerListResponseDto } from "./dto/customer-list-response.dto";
import { CustomerDto } from "./dto/customer.dto";
import { DeleteCustomerResponseDto } from "./dto/delete-customer-response.dto";
import {
  CustomerListSortBy,
  CustomerListSortOrder,
  ListCustomersQueryDto,
} from "./dto/list-customers-query.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    workspaceId: string,
    createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerDto> {
    await this.ensureWorkspaceExists(workspaceId);
    await this.ensureOwnerBelongsToWorkspace(workspaceId, createCustomerDto.ownerId);

    const customer = await this.prisma.customer.create({
      data: {
        workspaceId,
        ownerId: createCustomerDto.ownerId,
        firstName: createCustomerDto.firstName.trim(),
        lastName: createCustomerDto.lastName?.trim(),
        email: createCustomerDto.email?.trim().toLowerCase(),
        phone: createCustomerDto.phone?.trim(),
        status: createCustomerDto.status,
        preferredLanguage: createCustomerDto.preferredLanguage,
        source: createCustomerDto.source?.trim(),
        notes: createCustomerDto.notes?.trim(),
      },
      include: this.customerInclude,
    });

    return this.toCustomerDto(customer);
  }

  async findAll(
    workspaceId: string,
    query: ListCustomersQueryDto,
  ): Promise<CustomerListResponseDto> {
    await this.ensureWorkspaceExists(workspaceId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.CustomerWhereInput = {
      workspaceId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.ownerId ? { ownerId: query.ownerId } : {}),
    };

    if (query.search?.trim()) {
      const search = query.search.trim();
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const [customers, total, groupedByStatus] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        include: this.customerInclude,
        orderBy: this.buildCustomerOrderBy(query),
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.customer.count({ where }),
      this.prisma.customer.groupBy({
        by: ["status"],
        where,
        _count: {
          _all: true,
        },
      }),
    ]);

    const items = customers.map((customer) => this.toCustomerDto(customer));
    const pages = total === 0 ? 0 : Math.ceil(total / limit);
    const countsByStatus = groupedByStatus.reduce<
      Partial<Record<CustomerStatus, number>>
    >((accumulator, entry) => {
      accumulator[entry.status] = entry._count._all;
      return accumulator;
    }, {});

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNextPage: page < pages,
        hasPreviousPage: page > 1 && pages > 0,
      },
      filters: {
        search: query.search?.trim() || null,
        ownerId: query.ownerId ?? null,
        status: query.status ?? null,
        sortBy: query.sortBy ?? CustomerListSortBy.CREATED_AT,
        sortOrder: query.sortOrder ?? CustomerListSortOrder.DESC,
      },
      summary: {
        total,
        returned: items.length,
        countsByStatus: {
          NEW_LEAD: countsByStatus.NEW_LEAD ?? 0,
          CONTACTED: countsByStatus.CONTACTED ?? 0,
          BOOKED: countsByStatus.BOOKED ?? 0,
          ACTIVE: countsByStatus.ACTIVE ?? 0,
          INACTIVE: countsByStatus.INACTIVE ?? 0,
          LOST: countsByStatus.LOST ?? 0,
        },
      },
    };
  }

  async findOne(workspaceId: string, customerId: string): Promise<CustomerDto> {
    await this.ensureWorkspaceExists(workspaceId);

    const customer = await this.prisma.customer.findFirst({
      where: {
        id: customerId,
        workspaceId,
      },
      include: this.customerInclude,
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer "${customerId}" was not found in workspace "${workspaceId}".`,
      );
    }

    return this.toCustomerDto(customer);
  }

  async update(
    workspaceId: string,
    customerId: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerDto> {
    await this.ensureWorkspaceExists(workspaceId);
    await this.ensureCustomerExists(workspaceId, customerId);
    await this.ensureOwnerBelongsToWorkspace(workspaceId, updateCustomerDto.ownerId);

    const customer = await this.prisma.customer.update({
      where: { id: customerId },
      data: {
        ...(updateCustomerDto.ownerId !== undefined
          ? { ownerId: updateCustomerDto.ownerId || null }
          : {}),
        ...(updateCustomerDto.firstName !== undefined
          ? { firstName: updateCustomerDto.firstName.trim() }
          : {}),
        ...(updateCustomerDto.lastName !== undefined
          ? { lastName: updateCustomerDto.lastName?.trim() || null }
          : {}),
        ...(updateCustomerDto.email !== undefined
          ? { email: updateCustomerDto.email?.trim().toLowerCase() || null }
          : {}),
        ...(updateCustomerDto.phone !== undefined
          ? { phone: updateCustomerDto.phone?.trim() || null }
          : {}),
        ...(updateCustomerDto.status !== undefined
          ? { status: updateCustomerDto.status }
          : {}),
        ...(updateCustomerDto.preferredLanguage !== undefined
          ? { preferredLanguage: updateCustomerDto.preferredLanguage }
          : {}),
        ...(updateCustomerDto.source !== undefined
          ? { source: updateCustomerDto.source?.trim() || null }
          : {}),
        ...(updateCustomerDto.notes !== undefined
          ? { notes: updateCustomerDto.notes?.trim() || null }
          : {}),
      },
      include: this.customerInclude,
    });

    return this.toCustomerDto(customer);
  }

  async remove(
    workspaceId: string,
    customerId: string,
  ): Promise<DeleteCustomerResponseDto> {
    await this.ensureWorkspaceExists(workspaceId);
    await this.ensureCustomerExists(workspaceId, customerId);

    // TODO: Add soft-delete once retention and audit requirements are finalized.
    await this.prisma.customer.delete({
      where: { id: customerId },
    });

    return {
      id: customerId,
      workspaceId,
      deleted: true,
    };
  }

  private readonly customerInclude = {
    owner: {
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    },
    _count: {
      select: {
        appointments: true,
      },
    },
  } satisfies Prisma.CustomerInclude;

  private buildCustomerOrderBy(
    query: ListCustomersQueryDto,
  ): Prisma.CustomerOrderByWithRelationInput[] {
    const sortOrder = query.sortOrder ?? "desc";

    switch (query.sortBy) {
      case "firstName":
        return [{ firstName: sortOrder }, { lastName: sortOrder }];
      case "updatedAt":
        return [{ updatedAt: sortOrder }];
      case "status":
        return [{ status: sortOrder }, { createdAt: "desc" }];
      case "createdAt":
      default:
        return [{ createdAt: sortOrder }];
    }
  }

  private async ensureWorkspaceExists(workspaceId: string): Promise<void> {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { id: true },
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace "${workspaceId}" was not found.`);
    }
  }

  private async ensureCustomerExists(
    workspaceId: string,
    customerId: string,
  ): Promise<void> {
    const customer = await this.prisma.customer.findFirst({
      where: {
        id: customerId,
        workspaceId,
      },
      select: { id: true },
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer "${customerId}" was not found in workspace "${workspaceId}".`,
      );
    }
  }

  private async ensureOwnerBelongsToWorkspace(
    workspaceId: string,
    ownerId?: string | null,
  ): Promise<void> {
    if (!ownerId) {
      return;
    }

    const owner = await this.prisma.user.findFirst({
      where: {
        id: ownerId,
        workspaceId,
      },
      select: { id: true },
    });

    if (!owner) {
      throw new UnprocessableEntityException(
        `Owner "${ownerId}" does not belong to workspace "${workspaceId}".`,
      );
    }
  }

  private toCustomerDto(customer: {
    id: string;
    workspaceId: string;
    ownerId: string | null;
    firstName: string;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    status: CustomerStatus;
    preferredLanguage: PreferredLanguage;
    source: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    owner: {
      id: string;
      name: string;
      email: string;
      role: string;
    } | null;
    _count: {
      appointments: number;
    };
  }): CustomerDto {
    const fullName = [customer.firstName, customer.lastName]
      .filter((value): value is string => Boolean(value))
      .join(" ");

    return {
      id: customer.id,
      workspaceId: customer.workspaceId,
      ownerId: customer.ownerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      fullName,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
      preferredLanguage: customer.preferredLanguage,
      source: customer.source,
      notes: customer.notes,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      owner: customer.owner,
      appointmentsCount: customer._count.appointments,
    };
  }
}
