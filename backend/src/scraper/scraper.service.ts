import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright';
import { PrismaService } from '../prisma/prisma.service';

type ScrapedProduct = {
  sourceId: string;
  sourceUrl: string;
  title: string;
  price: number;
};

@Injectable()
export class ScraperService {
  constructor(private readonly prisma: PrismaService) {}

  // =====================================================
  // SEED CATEGORIES FROM NAVIGATION (SAFE & REQUIRED)
  // =====================================================
  async seedCategoriesFromNavigation(): Promise<void> {
    const navigations = await this.prisma.navigation.findMany();

    for (const nav of navigations) {
      await this.prisma.category.upsert({
        where: {
          navigationId_slug: {
            navigationId: nav.id,
            slug: nav.slug,
          },
        },
        update: {
          title: nav.title,
          lastScrapedAt: new Date(),
        },
        create: {
          navigationId: nav.id,
          title: nav.title,
          slug: nav.slug,
          lastScrapedAt: new Date(),
        },
      });
    }
  }

  // =====================================================
  // SCRAPE PRODUCTS BY CATEGORY SLUG (WoB FINAL VERSION)
  // =====================================================
  async scrapeProductsByCategory(slug: string): Promise<void> {
  const category = await this.prisma.category.findFirst({
    where: { slug },
  });

  if (!category) {
    throw new Error(`Category not found: ${slug}`);
  }

  const url = `https://www.worldofbooks.com/collections/${slug}`;
  console.log(`🛒 Scraping products from ${url}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 90000,
  });

  await page.waitForTimeout(5000);

  
  let products: ScrapedProduct[] = [];


  products = await page.evaluate<ScrapedProduct[]>(() => {
    return Array.from(document.querySelectorAll('a[href^="/products/"]'))
      .map((el) => {
        const href = el.getAttribute('href');
        const title = el.getAttribute('data-item_name');
        const priceRaw = el.getAttribute('data-price');
        const sourceId = el.getAttribute('data-item_ean');

        if (!href || !title || !priceRaw || !sourceId) return null;

        const price = Number(priceRaw);
        if (Number.isNaN(price)) return null;

        return {
          sourceId,
          title,
          price,
          sourceUrl: `https://www.worldofbooks.com${href}`,
        };
      })
      .filter((p): p is ScrapedProduct => p !== null);
  });

  // ✅ NOW TypeScript knows products exists
  console.log(`📦 Extracted ${products.length} products`);

  if (products.length === 0) {
    console.warn('⚠ No products extracted — page layout may have changed');
  }

  for (const p of products) {
    await this.prisma.product.upsert({
      where: { sourceId: p.sourceId },
      update: {
        title: p.title,
        price: p.price,
        currency: 'GBP',
        sourceUrl: p.sourceUrl,
        lastScrapedAt: new Date(),
      },
      create: {
        categoryId: category.id,
        sourceId: p.sourceId,
        title: p.title,
        price: p.price,
        currency: 'GBP',
        sourceUrl: p.sourceUrl,
        lastScrapedAt: new Date(),
      },
    });
  }

  await browser.close();
  console.log('✅ Product scraping completed');
}

}
