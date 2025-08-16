import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import type { Response } from 'express';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        id: 1,
        email: 'user@example.com',
        name: 'John Doe'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid input' })
  @ApiResponse({ status: 409, description: 'Conflict - user already exists' })
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'P@ssw0rd123' }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        id: 1,
        name: 'John Doe',
        role: 'USER',
        accessToken: 'eyJhbGciOi...',
        refreshToken: 'eyJhbGciOi...'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid credentials' })
  login(@Request() req) {
    return this.authService.login(req.user.id, req.user.name, req.user.role);
  }

  @Get('protected')
  @Roles('ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Protected endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Access granted',
    schema: {
      example: {
        message: 'Now you can access this protected API',
        userId: 1
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - missing/invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  getAll(@Request() req) {
    return {
      message: `Now you can access this protected API. this is your user ID: ${req.user.id}`,
    };
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refresh: { type: 'string', example: 'eyJhbGciOi...' }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed',
    schema: {
      example: {
        id: 1,
        name: 'John Doe',
        accessToken: 'eyJhbGciOi...',
        refreshToken: 'eyJhbGciOi...'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid refresh token' })
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id, req.user.name);
  }

  @Post('signout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  signOut(@Req() req) {
    return this.authService.signOut(req.user.id);
  }

  // Google auth endpoints kept simple for brevity
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  @ApiOperation({ summary: 'Initiate Google OAuth flow' })
  googleLogin() { }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleCallback(@Request() req, @Res() res: Response) {
    const response = await this.authService.login(
      req.user.id,
      req.user.name,
      req.user.role,
    );
    res.redirect(
      `http://localhost:3000/api/auth/google/callback?userId=${response.id}&name=${response.name}&accessToken=${response.accessToken}&refreshToken=${response.refreshToken}&role=${response.role}`,
    );
  }
}