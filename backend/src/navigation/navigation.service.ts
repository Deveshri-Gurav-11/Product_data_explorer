import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NavigationService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.navigation.findMany({
      orderBy: { id: 'asc' },
    });
  } // ✅ THIS CLOSING BRACE WAS MISSING

  async getCategoriesByNavigation(slug: string) {
    const navigation = await this.prisma.navigation.findFirst({
      where: { slug },
      include: {
        categories: {
          where: { parentId: null },
          include: { children: true },
          orderBy: { title: 'asc' },
        },
      },
    });

    if (!navigation) {
      return [];
    }

    return navigation.categories;
  }
  async getProductsByCategorySlug(slug: string) {
  const category = await this.prisma.category.findFirst({
    where: { slug },
    include: {
      products: {
        orderBy: { id: 'desc' },
      },
    },
  });

  if (!category) {
    return [];
  }

  return category.products;
}

}
