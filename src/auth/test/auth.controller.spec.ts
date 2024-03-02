import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import {CreateMemberDto} from "../../members/dto/create-member.dto";
import {RequestWithUserInterface} from "../interfaces/requestWithUser.interface";

// AuthService 모킹
const mockAuthService = {
  registerUser: jest.fn(),
  generateAccessToken: jest.fn(),
};

describe('AuthController', () => {
  let controller: Partial<AuthController>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      // 실제 AuthService 대신 모킹된 버전 제공
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    // 모킹된 함수들의 호출 이력을 클리어
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should call authService.registerUser with createMemberDto', async () => {
      const createMemberDto = new CreateMemberDto();
      // authService.registerUser가 반환할 가짜 값 설정
      mockAuthService.registerUser.mockResolvedValue('someValue');
      await controller.createUser(createMemberDto);
      expect(mockAuthService.registerUser).toHaveBeenCalledWith(createMemberDto);
    });
  });

  describe('loginUser', () => {
    it('should return a user and token', async () => {
      const req = {
        user: {id: 1, email: 'test@example.com', password: 'hashedPassword'},
      } as unknown as RequestWithUserInterface;

      mockAuthService.generateAccessToken.mockResolvedValue('token');
      const result = await controller.loginUser(req);
      expect(result).toHaveProperty('token');
      expect(result.user).toEqual(req.user);
      expect(mockAuthService.generateAccessToken).toHaveBeenCalledWith(req.user.id);
    });
  });

  describe('getUserInfo', () => {
    it('should return user info', async () => {
      const req = {user: {id: 1, name: 'Test User'}} as unknown as RequestWithUserInterface;
      const result = await controller.getUserInfo(req);
      expect(result).toEqual(req.user);
    });
  });
});
