import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto, UpdateExperienceDto } from './dto/experience.dto';
export declare class ExperiencesController {
    private readonly experiencesService;
    constructor(experiencesService: ExperiencesService);
    findAll(): Promise<{
        id: string;
        position: string;
        company: string;
        start_date: Date;
        end_date: Date | null;
        description: string | null;
        order: number;
        created_at: Date | null;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        position: string;
        company: string;
        start_date: Date;
        end_date: Date | null;
        description: string | null;
        order: number;
        created_at: Date | null;
    }>;
    create(createExperienceDto: CreateExperienceDto): Promise<{
        id: string;
        position: string;
        company: string;
        start_date: Date;
        end_date: Date | null;
        description: string | null;
        order: number;
        created_at: Date | null;
    }>;
    update(id: string, updateExperienceDto: UpdateExperienceDto): Promise<{
        id: string;
        position: string;
        company: string;
        start_date: Date;
        end_date: Date | null;
        description: string | null;
        order: number;
        created_at: Date | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        position: string;
        company: string;
        start_date: Date;
        end_date: Date | null;
        description: string | null;
        order: number;
        created_at: Date | null;
    }>;
}
