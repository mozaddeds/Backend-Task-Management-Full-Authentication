import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { Roles } from './auth/decorators/roles.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('protected')
  @Roles('ADMIN') // Or whatever roles you want to require
  getProtected() {
    return {
      message: 'This is a protected route',
      secret: 'Only authorized users can see this'
    };
  }
}
