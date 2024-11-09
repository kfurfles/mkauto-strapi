"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelToCar = void 0;
// import { ApiCarCar } from "../../types/generated/contentTypes";
function modelToCar(item) {
    // export function modelToCar(item: ContentType<"api::car.car", "brand" | "color" | "categories" | NonPopulatableAttributeNames<"api::car.car">>) {
    var _a, _b, _c, _d, _e;
    const { brand, color, id, model = "", noDeposit, freeDelivery, slug, compositeName, enable, seats, year, power, priceDaily, priceWeekly, priceMonthly, recommended, categories = [] } = item;
    return {
        brand: {
            name: (_a = brand === null || brand === void 0 ? void 0 : brand.name) !== null && _a !== void 0 ? _a : '',
            slug: (_b = brand === null || brand === void 0 ? void 0 : brand.slug) !== null && _b !== void 0 ? _b : '',
            url: brand.logo.url
        },
        color: {
            name: (_c = color === null || color === void 0 ? void 0 : color.name) !== null && _c !== void 0 ? _c : '',
            hex: (_d = color === null || color === void 0 ? void 0 : color.color) !== null && _d !== void 0 ? _d : '',
            slug: (_e = color === null || color === void 0 ? void 0 : color.slug) !== null && _e !== void 0 ? _e : '',
        },
        id: Number(id),
        model,
        noDeposit,
        freeDelivery,
        slug,
        compositeName,
        enable,
        seats,
        year,
        power,
        categories: categories.map((category) => {
            var _a, _b, _c, _d;
            return {
                name: (_a = category.name) !== null && _a !== void 0 ? _a : '',
                slug: (_b = category.slug) !== null && _b !== void 0 ? _b : '',
                url: (_d = (_c = category === null || category === void 0 ? void 0 : category.icon) === null || _c === void 0 ? void 0 : _c.url) !== null && _d !== void 0 ? _d : ''
            };
        }),
        priceDaily,
        priceWeekly,
        priceMonthly,
        recommended,
    };
}
exports.modelToCar = modelToCar;
