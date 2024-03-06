import { Controller } from '@nestjs/common';
import { CommonService } from './common.service';

@Controller('common')
export class CommonController {
  constructor(
    private readonly commonService: CommonService,
      ) {}



    // 통계
    // admin 만 조회 가능

    // 상품별 취소 내역 - 상위 5개
    // 상품별 취소 내역 - 페이징 , 검색 - 날짜


    // 상품별 판매 내역
    // 상품별 판매 내역 - 가장 많이 팔린 순으로, 검색 - 날짜순 조히
    // 조회 기능


    // 총 판매금액, 판매 개수 + 상품 원가 + 이름 + 카테고리 -- userId

    // 엑셀 파일 다운로드


}
