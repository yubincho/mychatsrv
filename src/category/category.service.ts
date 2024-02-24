import {HttpException, HttpStatus, Injectable, Post} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Category} from "./entities/category.entity";
import {Repository} from "typeorm";

@Injectable()
export class CategoryService {

  constructor(
      @InjectRepository(Category)
      private readonly categoryRepository: Repository<Category>,
  ) {}

  async createBrand(dto: CreateCategoryDto) {
    const brand = this.categoryRepository.create(dto)
    await this.categoryRepository.save(brand)
    return brand
  }


  async getAllCategory() {
    const brands = this.categoryRepository.find({
      relations: ['products'],
    })
    return brands
  }

  async getByIdOfCategory(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id } ,
      relations: ['products'],
    })
    if (!category) throw new HttpException('Category 가 없습니다.', HttpStatus.NOT_FOUND)

    return category
  }

  async deleteByIdOfCategory(id: string) {
    const category = await this.getByIdOfCategory(id)

    await this.categoryRepository.delete(category)
    return ' Category deleted.'
  }


}
