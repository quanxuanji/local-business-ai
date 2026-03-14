import { Body, Controller, Get, Post, Query } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { LogoutDto } from "./dto/logout.dto";
import { AuthSessionDto, LogoutResponseDto } from "./dto/auth-session.dto";
import { SessionQueryDto } from "./dto/session-query.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() loginDto: LoginDto): Promise<AuthSessionDto> {
    return this.authService.login(loginDto);
  }

  @Get("session")
  getSession(@Query() sessionQueryDto: SessionQueryDto): Promise<AuthSessionDto> {
    return this.authService.getSession(sessionQueryDto);
  }

  @Post("logout")
  logout(@Body() logoutDto: LogoutDto): Promise<LogoutResponseDto> {
    return this.authService.logout(logoutDto);
  }
}
