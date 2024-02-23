import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Product} from "./entities/product.entity";
import {Repository} from "typeorm";
import {CreateProductDto} from "../../dist/product/dto/create-product.dto";

@Injectable()
export class ProductService {

  constructor(
      @InjectRepository(Product)
      private readonly productRepository: Repository<Product>,
  ) {}


    async create(dto: CreateProductDto) {
        const newProduct = this.productRepository.create({...dto})
        await this.productRepository.save(newProduct)
        return newProduct
    }

    async getAll() {
      return await this.productRepository.find();
    }






}
