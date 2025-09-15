import React, { memo } from 'react';
import ProductImage from '../../ui/background/media/productImage/ProductImage';
import s from './ProductCard.module.scss';

/** Оптимальні розміри під 4-3-2 в ряд */
const DEFAULT_SIZES = '(min-width: 1200px) 25vw, (min-width: 768px) 33vw, 50vw';

/**
 * props:
 *  - p: { name, image, ... }
 *  - priority?: boolean
 *  - onClick?: () => void   // якщо є — картка стає <button>
 *  - focused?: boolean      // стилі картки у фокус-режимі
 *  - sizes?: string         // <img sizes>
 *  - imgProps?: object      // додаткові пропси до <img> всередині ProductImage
 *  - titleTag?: keyof JSX.IntrinsicElements  // тег заголовка, за замовч. 'h5'
 */
function ProductCardBase({
                             p,
                             priority = false,
                             onClick,
                             focused = false,
                             sizes = DEFAULT_SIZES,
                             imgProps = {},
                             titleTag: TitleTag = 'h5',
                         }) {
    const interactive = typeof onClick === 'function';
    const Tag = interactive ? 'button' : 'div';

    return (
        <Tag
            type={interactive ? 'button' : undefined}
            className={[
                s.productCard,
                interactive ? s.clickable : '',
                focused ? s.focused : '',
            ].filter(Boolean).join(' ')}
            role={interactive ? 'button' : 'group'}
            aria-label={p?.name || 'Картка товару'}
            onClick={interactive ? onClick : undefined}
            title={p?.name}
            data-interactive={interactive || undefined}
        >
            <div className={s.body}>
                {/* Фіксуємо геометрію, щоб уникнути CLS */}
                <div className={s.media} aria-hidden="true" style={{ aspectRatio: '3 / 4' }}>
                    <div className={s.mediaInner}>
                        <ProductImage
                            imageKey={p.image}
                            alt={p.name || 'Фото товару'}
                            basePath="/images/products"
                            fetchPriority={priority ? 'high' : 'auto'}
                            loading={priority ? 'eager' : 'lazy'}
                            decoding="async"
                            sizes={sizes}
                            {...imgProps}
                        />
                    </div>
                </div>

                <TitleTag className={s.title}>{p.name}</TitleTag>
            </div>
        </Tag>
    );
}

export default memo(ProductCardBase);
