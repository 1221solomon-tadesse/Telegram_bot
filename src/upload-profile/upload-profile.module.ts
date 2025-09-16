import { Module } from '@nestjs/common';
import { UploadProfileController } from './upload-profile.controller';
import { UploadProfileService } from './upload-profile.service';

@Module({
  controllers: [UploadProfileController],
  providers: [UploadProfileService]
})
export class UploadProfileModule { }
