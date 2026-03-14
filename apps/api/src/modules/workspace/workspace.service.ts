import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { WorkspaceDto } from "./dto/workspace.dto";

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWorkspaceDto: CreateWorkspaceDto): Promise<WorkspaceDto> {
    try {
      const workspace = await this.prisma.workspace.create({
        data: {
          name: createWorkspaceDto.name.trim(),
          slug: createWorkspaceDto.slug.trim().toLowerCase(),
          timezone: createWorkspaceDto.timezone ?? "UTC",
          locale: createWorkspaceDto.locale ?? "en",
        },
        include: {
          _count: {
            select: {
              users: true,
              customers: true,
              appointments: true,
            },
          },
        },
      });

      return this.toWorkspaceDto(workspace);
    } catch (error) {
      this.handleWorkspaceWriteError(error, createWorkspaceDto.slug);
    }
  }

  async findAll(): Promise<WorkspaceDto[]> {
    const workspaces = await this.prisma.workspace.findMany({
      include: {
        _count: {
          select: {
            users: true,
            customers: true,
            appointments: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return workspaces.map((workspace) => this.toWorkspaceDto(workspace));
  }

  async findOne(workspaceId: string): Promise<WorkspaceDto> {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        _count: {
          select: {
            users: true,
            customers: true,
            appointments: true,
          },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace "${workspaceId}" was not found.`);
    }

    return this.toWorkspaceDto(workspace);
  }

  async update(
    workspaceId: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ): Promise<WorkspaceDto> {
    await this.ensureWorkspaceExists(workspaceId);

    try {
      const workspace = await this.prisma.workspace.update({
        where: { id: workspaceId },
        data: {
          ...(updateWorkspaceDto.name ? { name: updateWorkspaceDto.name.trim() } : {}),
          ...(updateWorkspaceDto.slug
            ? { slug: updateWorkspaceDto.slug.trim().toLowerCase() }
            : {}),
          ...(updateWorkspaceDto.timezone
            ? { timezone: updateWorkspaceDto.timezone }
            : {}),
          ...(updateWorkspaceDto.locale ? { locale: updateWorkspaceDto.locale } : {}),
        },
        include: {
          _count: {
            select: {
              users: true,
              customers: true,
              appointments: true,
            },
          },
        },
      });

      return this.toWorkspaceDto(workspace);
    } catch (error) {
      this.handleWorkspaceWriteError(error, updateWorkspaceDto.slug);
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

  private handleWorkspaceWriteError(error: unknown, slug?: string): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictException(
        `Workspace slug "${slug ?? "unknown"}" is already in use.`,
      );
    }

    throw error;
  }

  private toWorkspaceDto(workspace: {
    id: string;
    name: string;
    slug: string;
    timezone: string;
    locale: string;
    createdAt: Date;
    updatedAt: Date;
    _count: {
      users: number;
      customers: number;
      appointments: number;
    };
  }): WorkspaceDto {
    return {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      timezone: workspace.timezone,
      locale: workspace.locale,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
      counts: {
        users: workspace._count.users,
        customers: workspace._count.customers,
        appointments: workspace._count.appointments,
      },
    };
  }
}
