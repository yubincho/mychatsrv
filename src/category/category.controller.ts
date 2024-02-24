import {Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseInterceptors} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {CustomAuthInterceptor} from "../common/interceptor/CustomAuthInterceptor";


@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}


  @UseInterceptors(CustomAuthInterceptor)
  @Post('/')
  async create(@Body(new ValidationPipe()) dto: CreateCategoryDto) {
    return await this.categoryService.createBrand(dto)
  }

  @Get()
  async getAll() {
    return await this.categoryService.getAllCategory()
  }


  @UseInterceptors(CustomAuthInterceptor)
  @Get('/:id')
  async getCategoryById(@Param('id') id: string) {
    return await this.categoryService.getByIdOfCategory(id)
  }


  @UseInterceptors(CustomAuthInterceptor)
  @Delete('/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.categoryService.deleteByIdOfCategory(id)
  }

}
