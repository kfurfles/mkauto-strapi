import { Core } from "@strapi/types";
import { errors } from '@strapi/utils'
import { get } from 'lodash'
import slugify from "slugify";
const { PolicyError } = errors
strapi as Core.Strapi

const captalize = (word: string) => {
  return (word[0].toUpperCase()+word.slice(1).toLowerCase()).trim()
}

export default {
  async beforeCreate(event) {
    const { data } = event.params
    const { year, model } = data

    const color = get(data, 'color.connect[0].name')
    const brand = get(data, 'brand.connect[0].name')

    if(!color){
      throw new PolicyError('Color is required!');
    }
    if(!brand){
      throw new PolicyError('Brand is required!');
    }
    
    const slug = slugify(`${model} ${color} ${year}`, { lower: true, trim: true })

    event.params.data.slug = slug
    event.params.data.compositeName = `${brand} ${model.trim()} ${captalize(color)} ${year.trim()}`
  },
  async beforeUpdate(event) {      
    const { data, where } = event.params
    
    const isDeleteColor = !!get(data,'color.disconnect[0].id')
    const isDeleteBrand = !!get(data,'brand.disconnect[0].id')

    if(isDeleteColor){
      if(!get(data,'color.connect[0].id')){
        throw new PolicyError('Color is required!');
      }
    }
    if(isDeleteBrand){
      if(!get(data,'brand.connect[0].id')){
        throw new PolicyError('Brand is required!');
      }
    }

    let { 
      model, year, 
      color: { name: color }, 
      brand: { name: brand } 
    } = await strapi.db.query('api::car.car').findOne({
      populate: true,
      where
    })

    const colorId = get(data,'color.connect[0].id')
    const brandId = get(data,'brand.connect[0].id')

    if(!!colorId){
      const entry = await strapi.db.query('api::color.color').findOne({
        populate: true,
        where: { id: colorId }
      })
      color = entry.name
    }

    if(!!brandId){
      const entry = await strapi.db.query('api::brand.brand').findOne({
        populate: true,
        where: { id: brandId }
      })
      color = entry.name
    }

    const slug = slugify(`${model} ${color} ${year}`, { lower: true, trim: true })
    event.params.data.slug = slug
    event.params.data.compositeName = `${brand} ${model.trim()} ${captalize(color)} ${year.trim()}`

    return event
  },
};