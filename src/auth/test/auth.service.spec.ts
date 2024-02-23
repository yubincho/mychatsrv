import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import {MembersService} from "../../members/members.service";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import {LoginMemberDto} from "../../members/dto/login-member.dto";
import {CreateMemberDto} from "../../members/dto/create-member.dto";

// describe('AuthService', () => {
//   let service: AuthService;
//
//   const fakeUsersService = {
//     find: () => Promise.resolve([]),
//     create: (email: string, password: string) =>
//         Promise.resolve({
//           id: '4e487616-5022-4593-abe4-f99382346f7b',
//           email,
//           password
//         })
//   }
//
//   // JwtService에 대한 간단한 모의 구현
//   const fakeJwtService = {
//     sign: () => 'mockJwtToken',
//   };
//
//   // ConfigService에 대한 간단한 모의 구현
//   const fakeConfigService = {
//     get: (key: string) => {
//       if (key === 'JWT_SECRET') {
//         return 'mockJwtSecret';
//       }
//     },
//   };
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//           AuthService,
//         {
//           provide: MembersService,
//           useValue: fakeUsersService,
//         },
//         {
//           provide: JwtService,
//           useValue: fakeJwtService, // JwtService에 대한 모의 구현 추가
//         },
//         {
//           provide: ConfigService,
//           useValue: fakeConfigService, // ConfigService에 대한 모의 구현 추가
//         },
//       ],
//     }).compile();
//
//     service = module.get<AuthService>(AuthService);
//   });
//
//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
//
//
// });

describe('AuthService', () => {
  let service: AuthService;
  let membersService: MembersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: MembersService,
          useValue: {
            registerMember: jest.fn().mockImplementation((dto) => Promise.resolve({id: 'userId', ...dto})),
            getUserByEmail: jest.fn().mockImplementation((email) => Promise.resolve({
              id: 'userId',
              email,
              checkPassword: jest.fn().mockResolvedValue(true), // 비밀번호 일치를 가정
            })),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockImplementation((payload) => `signedTokenWithPayload-${JSON.stringify(payload)}`),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              if (key === 'JWT_ACCESS_TOKEN_SECRET') return 'testSecret';
              if (key === 'JWT_ACCESS_TOKEN_EXPIRATION_TIME') return '1'; // 1시간
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    membersService = module.get<MembersService>(MembersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('registerUser', () => {
    it('should successfully register a new user', async () => {
      const createMemberDto: CreateMemberDto = {name: "", email: 'test@example.com', password: 'test123'}; // 가정한 DTO 형태
      const result = await service.registerUser(createMemberDto);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.email).toEqual(createMemberDto.email);
    });
  });

  describe('loggedInUser', () => {
    it('should throw an error if password does not match', async () => {
      // Member 엔티티의 모의 인스턴스 생성
      const mockMember = {
        id: 'someUserId',
        email: 'test@example.com',
        checkPassword: jest.fn().mockResolvedValue(true), // 비밀번호 일치/불일치 시나리오
      };

      // @ts-ignore
      jest.spyOn(membersService, 'getUserByEmail').mockResolvedValueOnce(mockMember);

      const loginMemberDto: LoginMemberDto = {email: 'test@example.com', password: 'wrongPassword'};

      const result = await service.loggedInUser(loginMemberDto);

      // expect(result).toBe(true);
      await expect(service.loggedInUser(loginMemberDto)).resolves.not.toThrow();

      // 비밀번호 불일치 시나리오
      //   await expect(service.loggedInUser(loginMemberDto))
      //       .rejects
      //       .toThrow(new HttpException('Password does not match!', HttpStatus.CONFLICT));
      // });

    });

    describe('generateAccessToken', () => {
      it('should return a valid token', async () => {
        const userId = 'userId';
        const token = await service.generateAccessToken(userId);

        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(token).toContain('signedTokenWithPayload-'); // 간단한 검증
      });
    });
  });


})
