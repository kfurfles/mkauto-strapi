// import { ContentType } from "@strapi/types/dist/data";
// import { NonPopulatableAttributeNames } from "@strapi/types/dist/schema";
import { Car } from "../../types";
// import { ApiCarCar } from "../../types/generated/contentTypes";

export function modelToCar(item: any) {
// export function modelToCar(item: ContentType<"api::car.car", "brand" | "color" | "categories" | NonPopulatableAttributeNames<"api::car.car">>) {

  const {
    brand,
    color,
    id,
    model = "",
    noDeposit,
    freeDelivery,
    slug,
    compositeName,
    enable,
    seats,
    year,
    power,
    priceDaily,
    priceWeekly,
    priceMonthly,
    recommended,
    categories = []
  } = item;
  
  return {
    brand: {
      name: brand?.name ?? '',
      slug: brand?.slug ?? '',
      url: brand.logo.url
    },
    color: {
      name: color?.name ?? '',
      hex: color?.color ?? '',
      slug: color?.slug ?? '',
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
      return { 
        name: category.name ?? '', 
        slug: category.slug ?? '', 
        url: category?.icon?.url ?? '' 
      }
    }),
    priceDaily,
    priceWeekly,
    priceMonthly,
    recommended,
  } as Car;
}
