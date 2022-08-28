import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "./ormconfig";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersLearnedWordsModule } from "./modules/users-learned-words/users-learned-words.module";
import { UsersSettingsModule } from "./modules/users-settings/users-settings.module";
import { UsersStatisticModule } from "./modules/users-statistic/users-statistic.module";
import { UsersWordsModule } from "./modules/users-words/users-words.module";
import { UsersModule } from "./modules/users/users.module";
import { WordsModule } from "./modules/words/words.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: "../.env" }),
        TypeOrmModule.forRoot(config),
        WordsModule,
        UsersModule,
        UsersWordsModule,
        UsersStatisticModule,
        UsersSettingsModule,
        AuthModule,
        UsersLearnedWordsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
