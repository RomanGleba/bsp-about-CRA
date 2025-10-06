import React, { memo } from 'react';
import ProductImage from '../../../ui/background/media/productImage/ProductImage';
import s from './ProductCard.module.scss';

function ProductCardBase({ p, priority = false, onClick, focused = false, sizes, imgProps, titleTag: TitleTag = 'h5' }) {
    const Tag = typeof onClick === 'function' ? 'button' : 'div';

    // Тут беремо ключ із API або формуємо вручну (products/...)
    const imageKey = p?.images?.[0]?.key || p?.imageKey || '';

    return (
        <Tag
            className={[
                s.productCard,
                onClick ? s.clickable : '',
                focused ? s.focused : '',
            ].filter(Boolean).join(' ')}
            onClick={onClick || undefined}
            type={onClick ? 'button' : undefined}
        >
            <div className={s.body}>
                <div className={s.media}>
                    <div className={s.mediaInner}>
                        <ProductImage
                            imageKey={imageKey}                // ← передаємо ключ products/...
                            alt={p?.name || 'Фото товару'}
                            basePath=""                        // CDN підставиться сам
                            fetchPriority={priority ? 'high' : 'auto'}
                            loading={priority ? 'eager' : 'lazy'}
                            decoding="async"
                            sizes={sizes}
                            {...imgProps}
                        />
                    </div>
                </div>
                <TitleTag className={s.title}>{p?.name}</TitleTag>
            </div>
        </Tag>
    );
}

export default memo(ProductCardBase);
