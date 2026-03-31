import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsEntity } from 'src/entities/News.entity';
import { Repository } from 'typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { CategoryService } from '../category/category.service';
import slugify from 'slugify';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(
    private categoryService: CategoryService,
    @InjectRepository(NewsEntity) private newsRepo: Repository<NewsEntity>,
  ) {}
  async list() {
    const news = await this.newsRepo.find({
      relations: ['category'],
    });
    console.log(news);

    return news;
  }

  async create(params: CreateNewsDto) {
    const category = await this.categoryService.findById(params.categoryId);
    if (!category) throw new NotFoundException('Category not found!');

    const newsItem = this.newsRepo.create({ ...params, category });
    await newsItem.save();

    return newsItem;
  }

  async update(id: number, params: UpdateNewsDto) {
    if (!params.slug && params.title) {
      params.slug = slugify(params.title, { lower: true, strict: true });
    }

    const news = await this.newsRepo.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!news)
      throw new NotFoundException(`News is not exists in provided ${id}`);

    const { categoryId, ...rest } = params;

    if (params.categoryId && news.category?.id != params.categoryId) {
      const category = await this.categoryService.findById(params.categoryId);
      if (!category) throw new NotFoundException('Category not found!');
      news.category = category;
    }

    Object.assign(news, rest);
    await news.save();
    return {
      message: 'News updated successfully',
    };
  }

  async remove(id: number) {
    const news = await this.newsRepo.findOne({ where: { id } });
    if (!news) throw new NotFoundException('News not found');

    await this.newsRepo.remove(news);

    return {
      message: 'News has been removed successfully',
    };
  }
}
