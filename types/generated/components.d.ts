import type { Struct, Schema } from '@strapi/strapi';

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    displayName: 'Slider';
    icon: 'address-book';
    description: '';
  };
  attributes: {
    images: Schema.Attribute.Component<'shared.media', true>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    name: 'Seo';
    icon: 'allergies';
    displayName: 'Seo';
    description: '';
  };
  attributes: {
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    displayName: 'Rich text';
    icon: 'align-justify';
    description: '';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    title: Schema.Attribute.String;
    body: Schema.Attribute.Text;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
    description: '';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'Navigation';
    icon: 'earth';
    description: '';
  };
  attributes: {
    link: Schema.Attribute.String;
    label: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['link', 'button']> &
      Schema.Attribute.DefaultTo<'link'>;
    icon: Schema.Attribute.Enumeration<
      [
        'MiArrowDown',
        'MiArrowLeft',
        'MiArrowRight',
        'MiArrowUp',
        'MiCarBody',
        'MiCarSeat',
        'MiCarSpeedometer',
        'MiCarTransmission',
        'MiCheck',
        'MiFilter',
        'MiInstagram',
        'MiLocationPin',
        'MiLoupe',
        'MiMail',
        'MiMenuBurger',
        'MiMicroChevronDown',
        'MiMicroChevronLeft',
        'MiMicroChevronRight',
        'MiMicroChevronUp',
        'MiPantone',
        'MiPhone',
        'MiSquareArrow',
        'MiSupportHead',
        'MiWhatsApp',
      ]
    >;
  };
}

export interface HeaderItemTypesButton extends Struct.ComponentSchema {
  collectionName: 'components_header_item_types_buttons';
  info: {
    displayName: 'Button';
  };
  attributes: {
    label: Schema.Attribute.String;
    link: Schema.Attribute.String;
  };
}

export interface CarSpecifications extends Struct.ComponentSchema {
  collectionName: 'components_car_specifications';
  info: {
    displayName: 'specifications';
    icon: 'hashtag';
    description: '';
  };
  attributes: {
    power: Schema.Attribute.String;
    seats: Schema.Attribute.String;
  };
}

export interface CarPrice extends Struct.ComponentSchema {
  collectionName: 'components_car_prices';
  info: {
    displayName: 'Price';
    icon: 'star';
    description: '';
  };
  attributes: {
    daily: Schema.Attribute.Decimal & Schema.Attribute.Required;
    weekly: Schema.Attribute.Decimal & Schema.Attribute.Required;
    monthly: Schema.Attribute.Decimal & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.slider': SharedSlider;
      'shared.seo': SharedSeo;
      'shared.rich-text': SharedRichText;
      'shared.quote': SharedQuote;
      'shared.media': SharedMedia;
      'shared.link': SharedLink;
      'header-item-types.button': HeaderItemTypesButton;
      'car.specifications': CarSpecifications;
      'car.price': CarPrice;
    }
  }
}
