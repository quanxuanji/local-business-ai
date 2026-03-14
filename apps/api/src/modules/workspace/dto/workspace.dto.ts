export class WorkspaceCountsDto {
  users!: number;
  customers!: number;
  appointments!: number;
}

export class WorkspaceDto {
  id!: string;
  name!: string;
  slug!: string;
  timezone!: string;
  locale!: string;
  createdAt!: Date;
  updatedAt!: Date;
  counts!: WorkspaceCountsDto;
}
