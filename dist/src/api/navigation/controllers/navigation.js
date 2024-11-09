"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    async menu(ctx, next) {
        const categoriesMap = new Map();
        const brandsMap = new Map();
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
        });
        cars.forEach(({ brand, categories }) => {
            var _a, _b;
            const brandData = brandsMap.get(brand.slug) || { total: 0, name: brand.name, url: (_b = (_a = brand.logo) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : '' };
            brandsMap.set(brand.slug, { ...brandData, total: brandData.total + 1 });
            categories.forEach((category) => {
                var _a, _b;
                const categoryData = categoriesMap.get(category.slug) || { total: 0, name: category.name, url: (_b = (_a = category.icon) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : '' };
                categoriesMap.set(category.slug, { ...categoryData, total: categoryData.total + 1 });
            });
        });
        const categories = [...categoriesMap.entries()].map(([key, value]) => {
            return {
                slug: key,
                ...value,
            };
        });
        const brands = [...brandsMap.entries()].map(([key, value]) => {
            return {
                slug: key,
                ...value,
            };
        });
        return {
            categories,
            brands
        };
    },
};
