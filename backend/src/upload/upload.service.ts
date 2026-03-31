import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UploadService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY') || this.configService.get<string>('SUPABASE_ANON_KEY'); // Use Service Role Key or Anon Key!

    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!this.supabase) {
      throw new InternalServerErrorException('Supabase credentials not configured in backend .env');
    }

    const fileExt = file.originalname.split('.').pop() || 'png';
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
    const filePath = `articles/${fileName}`;

    const { data, error } = await this.supabase.storage
      .from('images') // Ensure you have created a public bucket called 'images' in Supabase!
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new InternalServerErrorException('Failed to upload image to Supabase');
    }

    const { data: { publicUrl } } = this.supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return publicUrl;
  }

  async deleteImage(url: string): Promise<boolean> {
    if (!this.supabase) {
      throw new InternalServerErrorException('Supabase credentials not configured in backend .env');
    }

    try {
      console.log('Attempting to delete image:', url);
      // The URL format is usually: https://[project-id].supabase.co/storage/v1/object/public/images/articles/[filename]
      // We need to extract just "articles/[filename]"
      const match = url.match(/\/images\/(articles\/.*)/);
      
      if (match && match[1]) {
        const filePath = match[1];
        console.log('Extracted file path to delete:', filePath);
        
        const { error } = await this.supabase.storage
          .from('images')
          .remove([filePath]);

        if (error) {
          console.error('Supabase delete error:', error);
          return false;
        }
        console.log('Successfully deleted from Supabase storage:', filePath);
        return true;
      } else {
         console.warn('Could not extract file path from URL:', url);
      }
      return false;
    } catch (e) {
      console.error('Error parsing or deleting image:', e);
      return false;
    }
  }
}
