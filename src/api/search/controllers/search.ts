import type { Context, Next } from "koa";
import { Car, PaginationResponse } from "../../../../types";
import { modelToCar } from "../../../utils";

interface Filters extends Record<string, string> {
  brand?: string;
  category?: string;
  color?: string;
  price_min?: string;
  price_max?: string;
}

interface Pagination {
  page?: string;
  pageSize?: string;
}

interface Sort {
  sort?: "recommended" | "price-low-to-high" | "price-high-to-low";
}

type QueryParams = Filters & Pagination & Sort;

function getFilterFromCtx(params: QueryParams) {
  const findMany = strapi.documents("api::car.car").findMany;
  type Params = Parameters<typeof findMany>[0];

  const {
    page,
    pageSize,
    sort = "recommended",
    brand,
    category,
    color,
    price_max,
    price_min,
  } = params;

  const filters = {
    enable: true,
    $and: [] as any[],
  };

  if (brand) filters.$and.push({ brand: { slug: brand } });
  if (category) filters.$and.push({ categories: { slug: category } });
  if (color) filters.$and.push({ color: { slug: color } });

  if (price_min || price_max) {
    const priceFilter = {
      priceDaily: {},
    };

    if (price_min) {
      priceFilter.priceDaily["$gte"] = parseInt(price_min);
    }

    if (price_max) {
      priceFilter.priceDaily["$lte"] = parseInt(price_max);
    }

    filters.$and?.push(priceFilter);
  }

  if (filters.$and?.length === 0) {
    delete filters.$and;
  }

  const start = page ? (Number(page) - 1) * (Number(pageSize) || 25) : 0; 
  const limit = pageSize ? Number(pageSize) : 25;


  return {
    status: "published",
    start,
    limit,
    filters: filters,
    sort:
      sort === "recommended"
        ? "recommended:desc"
        : sort === "price-high-to-low"
        ? "priceDaily:desc"
        : "priceDaily:asc",
  } as Params;
}

async function SearchByFilters(params: QueryParams) {
  const queryParams = getFilterFromCtx(params);

  const cars = await strapi.documents("api::car.car").findMany({
    ...queryParams,
    populate: {
      color: true,
      brand: {
        populate: {
          logo: true
        }
      },
      categories: {
        populate: {
          icon: true
        }
      },
    },
  });

  const data: Car[] = cars.map((item) => modelToCar(item));

  return data;
}

export default {
  async search(ctx: Context, next: Next) {
    const query = ctx.query as QueryParams;
    const params = getFilterFromCtx(query);
    const { page, pageSize, ...rest } = params;
    const result = await SearchByFilters(query);
    const total = await strapi.documents("api::car.car").count({
      ...rest,
    });


    const totalPages = Math.ceil(total / pageSize);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data: result,
      meta: {
        page,
        pageSize,
        total,
        hasNext,
        hasPrev,
      },
    } as PaginationResponse<Car>;
  },
  async filter(ctx: Context, next: Next) {
    const query = ctx.query as QueryParams;
    const result = await SearchByFilters({
      ...query,
      page: "1",
      pageSize: "9999999",
    });


    const available = result.reduce(
      (acc, car, index) => {
        const { brand, categories, color } = car;
        acc.brands.set(car.brand.slug, {
          name: brand.name,
          slug: brand.slug,
          url: brand.url,
        });

        categories.forEach((category) =>
          acc.categories.set(category.slug, {
            name: category.name,
            slug: category.slug,
            url: category.url,
          })
        );

        acc.colors.set(color.slug, { hex: color.hex, name: color.name, slug: color.slug })

        if (index === 0) {
          acc.range.min = car.priceDaily;
          acc.range.max = car.priceDaily;
          return acc;
        }

        acc.range.min = Math.min(acc.range.min, car.priceDaily);
        acc.range.max = Math.max(acc.range.max, car.priceDaily);

        return acc;
      },
      {
        brands: new Map<string, { name: string; slug: string; url: string }>(),
        categories: new Map<string,{ name: string; slug: string; url: string }>(),
        colors: new Map<string,{ name: string; slug: string; hex: string }>(),
        range: {
          min: 0,
          max: 0,
        },
      }
    );

    const { brands, categories, colors, range } = available;

    return {
      total: result.length,
      available: {
        brands: Array.from(brands.keys()),
        categories: Array.from(categories.keys()),
        colors: Array.from(colors.keys()),
        range,
      },
      filters: {
        colors: Array.from(colors.values()),
        categories: Array.from(categories.values()),
        brands: Array.from(brands.values()),
        range,
      },
    };
  },
};
