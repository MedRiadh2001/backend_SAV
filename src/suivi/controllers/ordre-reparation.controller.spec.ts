import { Test, TestingModule } from '@nestjs/testing';
import { OrdreReparationController } from './ordre-reparation.controller';

describe('OrdreReparationController', () => {
  let controller: OrdreReparationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdreReparationController],
    }).compile();

    controller = module.get<OrdreReparationController>(OrdreReparationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
