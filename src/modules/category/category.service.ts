import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entities/Category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepo: Repository<CategoryEntity>,
  ) {}

  list() {
    return this.categoryRepo.find();
  }

  async create(params: CreateCategoryDto) {
    const newCategory = this.categoryRepo.create(params);
    await newCategory.save();

    return newCategory;
  }
}
