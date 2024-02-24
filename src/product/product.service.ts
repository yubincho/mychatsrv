import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Product} from "./entities/product.entity";
import {Repository} from "typeorm";
import {CreateProductDto} from "./dto/create-product.dto";
import {CategoryService} from "../category/category.service";

@Injectable()
export class ProductService {

  constructor(
      @InjectRepository(Product)
      private readonly productRepository: Repository<Product>,

      private readonly categoryService: CategoryService,
  ) {}


    async create(dto: CreateProductDto): Promise<Product> {
        const { categoryId, ...productDetails } = dto;

        const category = await this.categoryService.getByIdOfCategory(categoryId)

        const newProduct = this.productRepository.create({
                category,
                ...productDetails
        })
        await this.productRepository.save(newProduct)
        return newProduct
    }

    async getAll() {
      return await this.productRepository.find({
          relations: ['category'],
      });
    }


    async findOne(id: string) {
      const product = await this.productRepository.findOne({where: { id }})
      if (!product) throw new HttpException('No Product found', HttpStatus.NOT_FOUND)
        return product
    }




}
