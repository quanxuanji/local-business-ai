import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";

import { MessagingService } from "./messaging.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { ListMessagesQueryDto } from "./dto/list-messages-query.dto";
import type { MessageDto } from "./dto/message.dto";
import {
  MessageRouteParamsDto,
  WorkspaceMessagesParamsDto,
} from "./dto/workspace-messages-params.dto";

@Controller("workspaces/:workspaceId/messages")
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post()
  create(
    @Param() params: WorkspaceMessagesParamsDto,
    @Body() dto: CreateMessageDto,
  ): Promise<MessageDto> {
    return this.messagingService.create(params.workspaceId, dto);
  }

  @Get()
  findAll(
    @Param() params: WorkspaceMessagesParamsDto,
    @Query() query: ListMessagesQueryDto,
  ): Promise<MessageDto[]> {
    return this.messagingService.findAll(params.workspaceId, query);
  }

  @Get(":messageId")
  findOne(@Param() params: MessageRouteParamsDto): Promise<MessageDto> {
    return this.messagingService.findOne(params.workspaceId, params.messageId);
  }

  @Post(":messageId/send")
  send(@Param() params: MessageRouteParamsDto): Promise<MessageDto> {
    return this.messagingService.send(params.workspaceId, params.messageId);
  }

  @Delete(":messageId")
  remove(
    @Param() params: MessageRouteParamsDto,
  ): Promise<{ id: string; deleted: boolean }> {
    return this.messagingService.remove(params.workspaceId, params.messageId);
  }
}
