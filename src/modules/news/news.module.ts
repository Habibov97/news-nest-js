import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from 'src/entities/News.entity';
import { CategoryModule } from '../category/category.module';
import { NewsActionHistoryEntity } from 'src/entities/NewsActionHistory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewsEntity, NewsActionHistoryEntity]),
    CategoryModule,
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
