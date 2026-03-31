import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entities/Category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import slugify from 'slugify';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepo: Repository<CategoryEntity>,
  ) {}

  findById(categoryId: number) {
    return this.categoryRepo.findOne({ where: { id: categoryId } });
  }

  list() {
    return this.categoryRepo.find();
  }

  async create(params: CreateCategoryDto) {
    const newCategory = this.categoryRepo.create(params);
    await newCategory.save();

    return newCategory;
  }

  async update(id: number, params: UpdateCategoryDto) {
    if (!params.slug && params.name) {
      params.slug = slugify(params.name, { lower: true, strict: true });
    }

    const category = await this.categoryRepo.preload({
      id,
      ...params,
    });

    if (!category) throw new NotFoundException('Category not found');

    const updatedCategory = await this.categoryRepo.save(category);
    return {
      message: 'Category updated successfully',
      category: updatedCategory,
    };
  }

  async remove(id: number) {
    const category = await this.categoryRepo.findOne({
      where: { id },
    });

    if (!category) throw new NotFoundException('Category not found!');

    await this.categoryRepo.remove(category);

    return {
      message: 'Category has been deleted successfully!',
    };
  }
}
