import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { NewsService } from './news.services';
import { AuthGuard } from 'src/guards/auth.guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateNewsDto } from './dto/create-news.dto';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get()
  list() {
    const result = this.newsService.list();
    return result;
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  create(@Body() body: CreateNewsDto) {
    return this.newsService.create(body);
  }
}
