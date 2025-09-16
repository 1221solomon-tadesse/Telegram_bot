import { Test, TestingModule } from '@nestjs/testing';
import { UploadProfileController } from './upload-profile.controller';

describe('UploadProfileController', () => {
  let controller: UploadProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadProfileController],
    }).compile();

    controller = module.get<UploadProfileController>(UploadProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
