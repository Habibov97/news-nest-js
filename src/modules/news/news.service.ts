import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsEntity } from 'src/entities/News.entity';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { CategoryService } from '../category/category.service';
import slugify from 'slugify';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsListDto } from './dto/list-news.dto';
import { NewsActionType } from './news-types';
import { NewsActionHistoryEntity } from 'src/entities/NewsActionHistory.entity';

@Injectable()
export class NewsService {
  constructor(
    private categoryService: CategoryService,
    @InjectRepository(NewsEntity) private newsRepo: Repository<NewsEntity>,
    @InjectRepository(NewsActionHistoryEntity)
    private newsActionRepo: Repository<NewsActionHistoryEntity>,
  ) {}
  async list(params: NewsListDto) {
    let where: FindOptionsWhere<NewsEntity> = {};
    let order: FindOptionsOrder<NewsEntity> = {};

    if (params.popular) {
      order = {
        views: 'DESC',
        createdAt: 'DESC',
      };
    } else if (params.top) {
      order = {
        like: 'DESC',
        createdAt: 'DESC',
      };
    } else {
      order = { createdAt: 'DESC' };
    }

    if (params.category) {
      where.categoryId = params.category;
    }

    const [news, total] = await this.newsRepo.findAndCount({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
        createdAt: true,
        like: true,
        dislike: true,
        views: true,
        category: {
          id: true,
          name: true,
          slug: true,
        },
      },
      relations: ['category'],
      order,
      take: params.limit,
      skip: (params.page - 1) * params.limit,
    });

    return {
      news,
      total,
    };
  }

  async newsItem(id: number) {
    const newsItem = this.newsRepo.findOne({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        thumbnail: true,
        slug: true,
        like: true,
        dislike: true,
        views: true,
        category: {
          id: true,
          name: true,
          slug: true,
        },
        comments: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
      relations: ['category', 'comments', 'comments.user'],
      order: {
        comments: {
          createdAt: 'DESC',
        },
      },
    });

    return newsItem;
  }

  async create(params: CreateNewsDto) {
    const category = await this.categoryService.findById(params.categoryId);
    if (!category) throw new NotFoundException('Category not found!');

    const newsItem = this.newsRepo.create(params);
    await newsItem.save();

    return newsItem;
  }

  async action(newsId: number, type: NewsActionType, userId: number) {
    const news = await this.newsRepo.findOne({ where: { id: newsId } });

    if (!news) throw new NotFoundException('News not found!');

    const userAction = await this.newsActionRepo.findOne({
      where: {
        newsId: newsId,
        userId: userId,
        actionType: type,
      },
    });

    let increaseValue = 1;

    if (userAction && type !== NewsActionType.VIEW) {
      await userAction.remove();
      increaseValue = -1;
    } else {
      await this.newsActionRepo.save({ newsId, userId, actionType: type });
    }

    switch (type) {
      case NewsActionType.LIKE:
        await this.newsRepo.increment({ id: newsId }, 'like', increaseValue);
        break;
      case NewsActionType.DISLIKE:
        await this.newsRepo.increment({ id: newsId }, 'dislike', increaseValue);
        break;
      case NewsActionType.VIEW:
        await this.newsRepo.increment({ id: newsId }, 'view', increaseValue);
        break;
      default:
        throw new NotFoundException('Action is invalid!');
    }

    return {
      message: increaseValue === 1 ? 'Action added' : 'Action removed',
    };
  }

  async update(id: number, params: UpdateNewsDto) {
    if (!params.slug && params.title) {
      params.slug = slugify(params.title, { lower: true, strict: true });
    }

    const news = await this.newsRepo.findOne({
      where: { id },
    });

    if (!news)
      throw new NotFoundException(`News is not exists in provided ${id}`);

    if (params.categoryId && news.categoryId != params.categoryId) {
      const category = await this.categoryService.findById(params.categoryId);
      if (!category) throw new NotFoundException('Category not found!');
    }

    await this.newsRepo.update({ id }, params);

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
