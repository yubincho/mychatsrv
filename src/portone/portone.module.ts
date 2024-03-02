import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {PortoneService} from "./portone.service";

@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [PortoneService],
    exports: [PortoneService],
})
export class PortoneModule {}
