import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { UserSettingsEntity } from "./entities/users-settings.entity";
import { UsersSettingsController } from "./users-settings.controller";
import { UsersSettingsService } from "./users-settings.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserSettingsEntity]), forwardRef(() => UsersModule)],
    controllers: [UsersSettingsController],
    providers: [UsersSettingsService],
})
export class UsersSettingsModule {}
