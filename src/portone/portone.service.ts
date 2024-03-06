import {HttpException, Injectable, UnprocessableEntityException} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import axios from "axios";


@Injectable()
export class PortoneService {

    constructor(private readonly cfg: ConfigService) {}

    // 액세스 토큰(access token) 발급 받기
    async getToken(): Promise<string> {
        try {
            const result = await axios.post(`https://api.iamport.kr/users/getToken`, {
                imp_key: this.cfg.get('IMP_KEY'),
                imp_secret: this.cfg.get('IMP_SECRET'),
            })
            console.log(result)
            return result.data.response.access_token;
        } catch (error) {
            throw new HttpException(
                error.response.data.message,
                error.response.status,
            )
        }
    }

    /**
     * imp_uid로 포트원 서버에서 결제 정보 조회 (결제 됐는지 확인 )
     * 단건 조회
     * */
    async checkPaid({ impUid, quantity }): Promise<void> {
        try {
            const token = await this.getToken();
            const getPaymentData = await axios.get(
                `https://api.iamport.kr/payments/${impUid}`,
                {
                    headers: {
                        Authorization: token,
                    },
                },
            );
            console.log('[getPaymentData] :', getPaymentData)
            // 유저의 금액이 맞는지도 확인, 해킹 방지
            // Axios 예외
            if (quantity !== getPaymentData.data.response.amount ) {
                throw new UnprocessableEntityException('잘못된 결제 정보입니다.');
            }
        } catch (error) {
            // Http 예외
            error.response.message
            error.response.statusCode

            // portone에서 만든 메시지 그대로 사용함
            // Axios 예외
            //data: { code: -1, message: '존재하지 않는 결제정보입니다.', response: null }
            // error.response.data.message
            // error.response.status

            // console.error()
        }

    }


    /** 결제 취소하기 */
    async cancel({ impUid }) {
        try {
            const token = await this.getToken();
            const getCancelData  = await axios.post('https://api.iamport.kr/payments/cancel',
                {
                imp_uid: impUid,
                },
                {
                    headers: { Authorization: token },
                },
                )
            console.log('[getCancelData.data]', getCancelData.data)
            return getCancelData.data.response.cancel_amount; // 취소된 금액 반환

        } catch (error) {
            console.log('[error.response]', error.response);
            throw new HttpException(
                // portone에서 만든 메시지 그대로 사용함
                error.response.data.message,
                error.response.status,
            )
        }
    }



}