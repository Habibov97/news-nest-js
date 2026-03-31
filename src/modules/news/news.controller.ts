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
} from '@nestjs/common';
import { NewsService } from './news.service';
import { AuthGuard } from 'src/guards/auth.guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsListDto } from './dto/list-news.dto';
import { NewsActionType } from './news-types';
import type { AuthorizedUser } from '../auth/auth.types';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get()
  list(@Query() query: NewsListDto) {
    const result = this.newsService.list(query);
    return result;
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  create(@Body() body: CreateNewsDto) {
    return this.newsService.create(body);
  }

  @Post(':id/action/:type')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  action(
    @Param('id') id: number,
    @Param('type') type: NewsActionType,
    @Req() req: AuthorizedUser,
  ) {
    return this.newsService.action(id, type, req.user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
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
