"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@strapi/utils");
const lodash_1 = require("lodash");
const slugify_1 = __importDefault(require("slugify"));
const { PolicyError } = utils_1.errors;
const captalize = (word) => {
    return (word[0].toUpperCase() + word.slice(1).toLowerCase()).trim();
};
exports.default = {
    async beforeCreate(event) {
        const { data } = event.params;
        const { year, model } = data;
        const color = (0, lodash_1.get)(data, 'color.connect[0].name');
        const brand = (0, lodash_1.get)(data, 'brand.connect[0].name');
        if (!color) {
            throw new PolicyError('Color is required!');
        }
        if (!brand) {
            throw new PolicyError('Brand is required!');
        }
        const slug = (0, slugify_1.default)(`${model} ${color} ${year}`, { lower: true, trim: true });
        event.params.data.slug = slug;
        event.params.data.compositeName = `${brand} ${model.trim()} ${captalize(color)} ${year}`;
    },
    async beforeUpdate(event) {
        const { data, where } = event.params;
        const isDeleteColor = !!(0, lodash_1.get)(data, 'color.disconnect[0].id');
        const isDeleteBrand = !!(0, lodash_1.get)(data, 'brand.disconnect[0].id');
        if (isDeleteColor) {
            if (!(0, lodash_1.get)(data, 'color.connect[0].id')) {
                throw new PolicyError('Color is required!');
            }
        }
        if (isDeleteBrand) {
            if (!(0, lodash_1.get)(data, 'brand.connect[0].id')) {
                throw new PolicyError('Brand is required!');
            }
        }
        let { model, year, color: { name: color }, brand: { name: brand } } = await strapi.db.query('api::car.car').findOne({
            populate: true,
            where
        });
        const colorId = (0, lodash_1.get)(data, 'color.connect[0].id');
        const brandId = (0, lodash_1.get)(data, 'brand.connect[0].id');
        if (!!colorId) {
            const entry = await strapi.db.query('api::color.color').findOne({
                populate: true,
                where: { id: colorId }
            });
            color = entry.name;
        }
        if (!!brandId) {
            const entry = await strapi.db.query('api::brand.brand').findOne({
                populate: true,
                where: { id: brandId }
            });
            color = entry.name;
        }
        const slug = (0, slugify_1.default)(`${model} ${color} ${year}`, { lower: true, trim: true });
        event.params.data.slug = slug;
        event.params.data.compositeName = `${brand} ${model.trim()} ${captalize(color)} ${year}`;
        return event;
    },
};
