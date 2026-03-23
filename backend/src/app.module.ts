import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    ProjectsModule,
    ExperiencesModule,
    ArticlesModule,
    AuthModule,
  ],
})
export class AppModule {}
