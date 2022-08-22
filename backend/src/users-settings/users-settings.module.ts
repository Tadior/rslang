import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSettingsEntity } from './entities/users-settings.entity';
import { UsersSettingsController } from './users-settings.controller';
import { UsersSettingsService } from './users-settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSettingsEntity])],
  controllers: [UsersSettingsController],
  providers: [UsersSettingsService],
})
export class UsersSettingsModule {}
