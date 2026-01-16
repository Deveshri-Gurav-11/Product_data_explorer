import { Controller, Get, Post, Param } from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { ScraperService } from '../scraper/scraper.service';

@Controller('navigation')
export class NavigationController {
  constructor(
    private readonly navigationService: NavigationService,
    private readonly scraperService: ScraperService,
  ) {}

  @Get()
  findAll() {
    return this.navigationService.findAll();
  }

  // ✅ PRODUCT SCRAPE
  @Post(':slug/products/scrape')
async scrapeProducts(@Param('slug') slug: string) {
  await this.scraperService.scrapeProductsByCategory(slug);
  return { status: 'ok' };
}


  // ✅ CATEGORY FETCH
  @Get(':slug/categories')
  async getCategories(@Param('slug') slug: string) {
    return this.navigationService.getCategoriesByNavigation(slug);
  }
  @Post('categories/seed')
async seedCategories() {
  await this.scraperService.seedCategoriesFromNavigation();
  return { status: 'ok' };
}
@Get(':slug/products')
async getProducts(@Param('slug') slug: string) {
  return this.navigationService.getProductsByCategorySlug(slug);
}


}
