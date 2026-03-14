import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";

import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { CustomerListResponseDto } from "./dto/customer-list-response.dto";
import { CustomerDto } from "./dto/customer.dto";
import { DeleteCustomerResponseDto } from "./dto/delete-customer-response.dto";
import { ListCustomersQueryDto } from "./dto/list-customers-query.dto";
import {
  CustomerRouteParamsDto,
  WorkspaceCustomersParamsDto,
} from "./dto/workspace-customers-params.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";

@Controller("workspaces/:workspaceId/customers")
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(
    @Param() params: WorkspaceCustomersParamsDto,
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerDto> {
    return this.customersService.create(params.workspaceId, createCustomerDto);
  }

  @Get()
  findAll(
    @Param() params: WorkspaceCustomersParamsDto,
    @Query() query: ListCustomersQueryDto,
  ): Promise<CustomerListResponseDto> {
    return this.customersService.findAll(params.workspaceId, query);
  }

  @Get(":customerId")
  findOne(@Param() params: CustomerRouteParamsDto): Promise<CustomerDto> {
    return this.customersService.findOne(params.workspaceId, params.customerId);
  }

  @Patch(":customerId")
  update(
    @Param() params: CustomerRouteParamsDto,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerDto> {
    return this.customersService.update(
      params.workspaceId,
      params.customerId,
      updateCustomerDto,
    );
  }

  @Delete(":customerId")
  remove(
    @Param() params: CustomerRouteParamsDto,
  ): Promise<DeleteCustomerResponseDto> {
    return this.customersService.remove(params.workspaceId, params.customerId);
  }
}
