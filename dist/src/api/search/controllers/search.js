"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../utils");
function getFilterFromCtx(params) {
    var _a, _b;
    const findMany = strapi.documents("api::car.car").findMany;
    const { page, pageSize, sort = "recommended", brand, category, color, price_max, price_min, } = params;
    const filters = {
        enable: true,
        $and: [],
    };
    if (brand)
        filters.$and.push({ brand: { slug: brand } });
    if (category)
        filters.$and.push({ categories: { slug: category } });
    if (color)
        filters.$and.push({ color: { slug: color } });
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
        (_a = filters.$and) === null || _a === void 0 ? void 0 : _a.push(priceFilter);
    }
    if (((_b = filters.$and) === null || _b === void 0 ? void 0 : _b.length) === 0) {
        delete filters.$and;
    }
    const start = page ? (Number(page) - 1) * (Number(pageSize) || 25) : 0;
    const limit = pageSize ? Number(pageSize) : 25;
    return {
        status: "published",
        start,
        limit,
        filters: filters,
        sort: sort === "recommended"
            ? "recommended:desc"
            : sort === "price-high-to-low"
                ? "priceDaily:desc"
                : "priceDaily:asc",
    };
}
async function SearchByFilters(params) {
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
    const data = cars.map((item) => (0, utils_1.modelToCar)(item));
    return data;
}
exports.default = {
    async search(ctx, next) {
        const query = ctx.query;
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
        };
    },
    async filter(ctx, next) {
        const query = ctx.query;
        const result = await SearchByFilters({
            ...query,
            page: "1",
            pageSize: "9999999",
        });
        const available = result.reduce((acc, car, index) => {
            const { brand, categories, color } = car;
            acc.brands.set(car.brand.slug, {
                name: brand.name,
                slug: brand.slug,
                url: brand.url,
            });
            categories.forEach((category) => acc.categories.set(category.slug, {
                name: category.name,
                slug: category.slug,
                url: category.url,
            }));
            acc.colors.set(color.slug, { hex: color.hex, name: color.name, slug: color.slug });
            if (index === 0) {
                acc.range.min = car.priceDaily;
                acc.range.max = car.priceDaily;
                return acc;
            }
            acc.range.min = Math.min(acc.range.min, car.priceDaily);
            acc.range.max = Math.max(acc.range.max, car.priceDaily);
            return acc;
        }, {
            brands: new Map(),
            categories: new Map(),
            colors: new Map(),
            range: {
                min: 0,
                max: 0,
            },
        });
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
