import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";


@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async (
                configService: ConfigService,
            ): Promise<TypeOrmModuleOptions> => ({
                
            })
        })
    ]
})