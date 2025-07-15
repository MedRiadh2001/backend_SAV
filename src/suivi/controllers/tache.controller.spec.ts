import { Test, TestingModule } from '@nestjs/testing';
import { TacheController } from './tache.controller';

describe('TacheController', () => {
  let controller: TacheController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TacheController],
    }).compile();

    controller = module.get<TacheController>(TacheController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
