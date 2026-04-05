import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { AuthGuard } from 'src/guards/auth.guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsListDto } from './dto/list-news.dto';
import { NewsActionType } from './news-types';
import type { AuthorizedRequest } from '../auth/auth.types';
import { Roles } from 'src/shared/decorator/role.decorator';
import { UserRole } from '../user/user.types';
import { LogRequestTimeInterceptor } from 'src/interceptors/log-request-time.interceptor';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get()
  @UseInterceptors(LogRequestTimeInterceptor)
  list(@Query() query: NewsListDto) {
    const result = this.newsService.list(query);
    return result;
  }

  @Get(':id')
  newsItem(@Param('id') id: number) {
    return this.newsService.newsItem(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  create(@Body() body: CreateNewsDto) {
    return this.newsService.create(body);
  }

  @Post(':id/action/:type')
  @ApiBearerAuth()
  @Roles(UserRole.GUEST)
  @UseGuards(AuthGuard)
  action(
    @Param('id') id: number,
    @Param('type') type: NewsActionType,
    @Req() req: AuthorizedRequest,
  ) {
    return this.newsService.action(id, type, req.user.id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  update(@Param('id') id: number, @Body() body: UpdateNewsDto) {
    const result = this.newsService.update(id, body);

    return result;
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  remove(@Param('id') id: number) {
    const result = this.newsService.remove(id);
    return result;
  }
}
