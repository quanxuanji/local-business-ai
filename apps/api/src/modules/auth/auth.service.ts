import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { LogoutDto } from "./dto/logout.dto";
import { AuthSessionDto, LogoutResponseDto } from "./dto/auth-session.dto";
import { SessionQueryDto } from "./dto/session-query.dto";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(loginDto: LoginDto): Promise<AuthSessionDto> {
    const normalizedEmail = loginDto.email.trim().toLowerCase();
    const workspace = await this.prisma.workspace.findUnique({
      where: { slug: loginDto.workspaceSlug },
      select: {
        id: true,
        name: true,
        slug: true,
        timezone: true,
        locale: true,
      },
    });

    if (!workspace) {
      throw new NotFoundException(
        `Workspace with slug "${loginDto.workspaceSlug}" was not found.`,
      );
    }

    let user = await this.prisma.user.findUnique({
      where: {
        workspaceId_email: {
          workspaceId: workspace.id,
          email: normalizedEmail,
        },
      },
      select: {
        id: true,
        workspaceId: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          workspaceId: workspace.id,
          email: normalizedEmail,
          name: this.resolveUserName(loginDto),
        },
        select: {
          id: true,
          workspaceId: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } else if (loginDto.name?.trim() && user.name !== loginDto.name.trim()) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { name: loginDto.name.trim() },
        select: {
          id: true,
          workspaceId: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    return this.toSessionDto({
      workspace,
      user,
      issuedAt: new Date(),
    });
  }

  async getSession(sessionQueryDto: SessionQueryDto): Promise<AuthSessionDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: sessionQueryDto.userId,
        workspaceId: sessionQueryDto.workspaceId,
      },
      select: {
        id: true,
        workspaceId: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
            timezone: true,
            locale: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("Session user was not found in the workspace.");
    }

    return this.toSessionDto({
      workspace: user.workspace,
      user: {
        id: user.id,
        workspaceId: user.workspaceId,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      issuedAt: new Date(),
    });
  }

  async logout(logoutDto: LogoutDto): Promise<LogoutResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: logoutDto.userId,
        workspaceId: logoutDto.workspaceId,
      },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException("Session user was not found in the workspace.");
    }

    return {
      success: true,
      workspaceId: logoutDto.workspaceId,
      userId: logoutDto.userId,
      message:
        "Logout acknowledged for MVP auth. TODO: invalidate persisted sessions when token storage is added.",
    };
  }

  private resolveUserName(loginDto: LoginDto): string {
    if (loginDto.name?.trim()) {
      return loginDto.name.trim();
    }

    const localPart = loginDto.email.split("@")[0] ?? "operator";
    return localPart
      .split(/[._-]/)
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" ");
  }

  private toSessionDto(input: {
    workspace: {
      id: string;
      name: string;
      slug: string;
      timezone: string;
      locale: string;
    };
    user: {
      id: string;
      workspaceId: string;
      email: string;
      name: string;
      role: string;
      createdAt: Date;
      updatedAt: Date;
    };
    issuedAt: Date;
  }): AuthSessionDto {
    const expiresAt = new Date(input.issuedAt.getTime() + 12 * 60 * 60 * 1000);

    // TODO: Replace this deterministic token with signed session or JWT issuance.
    const sessionToken = `dev-session-${input.workspace.id}-${input.user.id}`;

    return {
      sessionToken,
      issuedAt: input.issuedAt,
      expiresAt,
      workspace: input.workspace,
      user: input.user,
    };
  }
}
