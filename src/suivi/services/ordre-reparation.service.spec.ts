import { Test, TestingModule } from '@nestjs/testing';
import { OrdreReparationService } from './ordre-reparation.service';

describe('OrdreReparationService', () => {
  let service: OrdreReparationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdreReparationService],
    }).compile();

    service = module.get<OrdreReparationService>(OrdreReparationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
