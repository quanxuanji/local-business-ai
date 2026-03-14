export class AuthSessionWorkspaceDto {
  id!: string;
  name!: string;
  slug!: string;
  timezone!: string;
  locale!: string;
}

export class AuthSessionUserDto {
  id!: string;
  workspaceId!: string;
  email!: string;
  name!: string;
  role!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class AuthSessionDto {
  sessionToken!: string;
  issuedAt!: Date;
  expiresAt!: Date;
  workspace!: AuthSessionWorkspaceDto;
  user!: AuthSessionUserDto;
}

export class LogoutResponseDto {
  success!: boolean;
  workspaceId!: string;
  userId!: string;
  message!: string;
}
