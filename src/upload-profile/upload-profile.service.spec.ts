import { Test, TestingModule } from '@nestjs/testing';
import { UploadProfileService } from './upload-profile.service';

describe('UploadProfileService', () => {
  let service: UploadProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadProfileService],
    }).compile();

    service = module.get<UploadProfileService>(UploadProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
