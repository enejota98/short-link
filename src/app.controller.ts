import { BadRequestException, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response, response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async encode(
    @Req()
    req: Request
  ) {
    try {
      return await this.appService.encode(req);
    } catch (error) {
      throw new BadRequestException(error.response)
    }
  }

  @Get(':code')
  async decode(
    @Param('code')
    code: string,
    @Res()
    response: Response
  ){
      const link = await this.appService.decode(code)
      response.redirect(link.url)
  }
}
