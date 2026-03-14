import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";

import { WorkspaceService } from "./workspace.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { WorkspaceDto } from "./dto/workspace.dto";
import { WorkspaceIdParamDto } from "./dto/workspace-id-param.dto";

@Controller("workspaces")
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  create(@Body() createWorkspaceDto: CreateWorkspaceDto): Promise<WorkspaceDto> {
    return this.workspaceService.create(createWorkspaceDto);
  }

  @Get()
  findAll(): Promise<WorkspaceDto[]> {
    return this.workspaceService.findAll();
  }

  @Get(":workspaceId")
  findOne(@Param() params: WorkspaceIdParamDto): Promise<WorkspaceDto> {
    return this.workspaceService.findOne(params.workspaceId);
  }

  @Patch(":workspaceId")
  update(
    @Param() params: WorkspaceIdParamDto,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ): Promise<WorkspaceDto> {
    return this.workspaceService.update(params.workspaceId, updateWorkspaceDto);
  }
}
