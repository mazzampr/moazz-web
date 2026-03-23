export declare class CreateExperienceDto {
    position: string;
    company: string;
    start_date: string;
    end_date?: string;
    description: string;
    order?: number;
}
export declare class UpdateExperienceDto {
    position?: string;
    company?: string;
    start_date?: string;
    end_date?: string;
    description?: string;
    order?: number;
}
