import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Configuration } from "../entities/Configuration.entity";
import { Repository } from "typeorm";
import { UpdateConfigurationDto } from "../types/dtos/update_configuration";

@Injectable()
export class ConfigurationService {
    constructor(@InjectRepository(Configuration) private configRepo: Repository<Configuration>) { }

    async get() {
        let config = await this.configRepo.findOneBy({});
        if (!config) {
            config = this.configRepo.create({
                parallelTasksPerTechnician: false,
                multiTechniciansPerTask: false,
                onlyCreatorEndTask: true,
            });
            await this.configRepo.save(config);
        }
        return config;
    }

    async update(id: string, dto: UpdateConfigurationDto) {
        await this.configRepo.update(id, dto);
        return this.configRepo.findOneBy({ id });
    }
}