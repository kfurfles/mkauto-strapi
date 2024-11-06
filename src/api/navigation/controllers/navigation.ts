import type { Context, Next } from 'koa';

export default {
    async menu(ctx: Context, next: Next) {
      const categoriesMap = new Map<string, { total: number, name: string, url: string }>()
      const brandsMap = new Map<string, { total: number, name: string, url: string }>()

      const cars = await strapi.db.query('api::car.car').findMany({
        populate: {
          brand: {
            populate: {
              logo: true
            }
          },
          categories: {
            populate: {
              icon: true
            }
          }
        }
      })

      cars.forEach(({ brand, categories }) => {
        const brandData = brandsMap.get(brand.slug) || { total: 0, name: brand.name, url: brand.logo?.url ?? '' };
        brandsMap.set(brand.slug, { ...brandData, total: brandData.total + 1 });
  
        categories.forEach((category) => {
          const categoryData = categoriesMap.get(category.slug) || { total: 0, name: category.name, url: category.icon?.url ?? '' };
          categoriesMap.set(category.slug, { ...categoryData, total: categoryData.total + 1 });
        });
      });

      const categories = [...categoriesMap.entries()].map(([key, value]) => {
        return {
          slug: key,
          ...value,
        }
      })

      const brands = [...brandsMap.entries()].map(([key, value]) => {
        return {
          slug: key,
          ...value,
        }
      })

      return {
        categories,
        brands
      }
    },
  };
