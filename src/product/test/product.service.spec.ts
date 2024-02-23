import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import {Product} from "../entities/product.entity";
import {getRepositoryToken} from "@nestjs/typeorm";
import {CreateProductDto} from "../dto/create-product.dto";
import {Repository} from "typeorm";

// MockType 정의를 간소화하거나 명확하게 하기
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

// 사용 예시
const mockRepository = (): MockRepository<Product> => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn().mockReturnValue({}), // mockReturnValue를 여기서 호출
  save: jest.fn().mockResolvedValue({}), // 비동기 메소드에 대해서는 mockResolvedValue 사용
  // 다른 메서드들을 여기에 추가
});



describe('ProductService', () => {
  let service: ProductService;
  let productRepository: MockRepository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get(getRepositoryToken(Product)); // 타입 캐스팅 없이 직접 사용
  });

  it('get all products', async () => {
    const product: CreateProductDto = {
      name: 'mockProduct',
      description: "this is a mockProduct",
      prodImage: "",
      price: 1000,
    };

    // 모킹된 메서드에 대한 반환값 설정
    productRepository.create.mockReturnValue(product); // 여기서 mockReturnValue를 사용하여 반환값 설정
    productRepository.save.mockResolvedValue(product); // 비동기 메소드에 대해서는 mockResolvedValue 사용

    // 서비스를 통해 제품 생성
    const savedProduct = await service.create(product);

    // 검증
    expect(savedProduct).toMatchObject(product);
  });
});
