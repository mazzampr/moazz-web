import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto, UpdateExperienceDto } from './dto/experience.dto';
export declare class ExperiencesController {
    private readonly experiencesService;
    constructor(experiencesService: ExperiencesService);
    findAll(): Promise<{
        description: string | null;
        id: string;
        created_at: Date | null;
        position: string;
        company: string;
        start_date: Date;
        end_date: Date | null;
        order: number;
    }[]>;
    findById(id: string): Promise<{
        description: string | null;
        id: string;
        created_at: Date | null;
        position: string;
        company: string;
        start_date: Date;
        end_date: Date | null;
        order: number;
    }>;
    create(createExperienceDto: CreateExperienceDto): Promise<{
        description: string | null;
        id: string;
        created_at: Date | null;
        position: string;
        company: string;
        start_date: Date;
        end_date: Date | null;
        order: number;
    }>;
    update(id: string, updateExperienceDto: UpdateExperienceDto): Promise<{
        description: string | null;
        id: string;
        created_at: Date | null;
        position: string;
        company: string;
        start_date: Date;
        end_date: Date | null;
        order: number;
    }>;
    delete(id: string): Promise<{
        description: string | null;
        id: string;
        created_at: Date | null;
        position: string;
        company: string;
        start_date: Date;
        end_date: Date | null;
        order: number;
    }>;
}
