import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto, UpdateExperienceDto } from './dto/experience.dto';
export declare class ExperiencesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        description: string | null;
        created_at: Date | null;
        position: string;
        company: string;
        start_date: Date;
        end_date: Date | null;
        order: number;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        description: string | null;
        created_at: Date | null;
        position: string;
        company: string;
        start_date: Date;
        end_date: Date | null;
        order: number;
    }>;
    create(data: CreateExperienceDto): Promise<{
        id: string;
        description: string | null;
        created_at: Date | null;
        position: string;
        company: string;
        start_date: Date;
        end_date: Date | null;
        order: number;
    }>;
    update(id: string, data: UpdateExperienceDto): Promise<{
        id: string;
        description: string | null;
        created_at: Date | null;
        position: string;
        company: string;
        start_date: Date;
        end_date: Date | null;
        order: number;
    }>;
    delete(id: string): Promise<{
        id: string;
        description: string | null;
        created_at: Date | null;
        position: string;
        company: string;
        start_date: Date;
        end_date: Date | null;
        order: number;
    }>;
}
