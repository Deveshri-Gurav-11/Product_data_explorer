import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { NavigationModule } from './navigation/navigation.module';
import { ScraperModule } from './scraper/scraper.module';


@Module({
  imports: [PrismaModule, NavigationModule, ScraperModule],
})
export class AppModule {}
