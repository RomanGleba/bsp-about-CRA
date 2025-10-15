import React, { memo } from 'react';
import ProductImage from '../../../ui/background/media/productImage/ProductImage';
import s from './ProductCard.module.scss';

const hasExt = s => /\.[a-z0-9]+$/i.test(s || '');

function toImageKey(p) {
    let k = p?.images?.[0]?.key || p?.imageKey || p?.image || '';
    if (!k) return '';
    k = String(k).replace(/^\/+/, '');
    if (/^https?:\/\//i.test(k) || k.startsWith('/')) return k;
    if (!/^(products|brands)\//i.test(k)) k = `products/${k}`;
    if (!hasExt(k)) k += '.webp';
    return k;
}

function formatWeight(p) {
    const grams = Number.isFinite(p?.weightGrams) ? Number(p.weightGrams)
        : Number.isFinite(p?.price) ? Number(p.price)
            : 0;
    if (!grams) return '';
    if (grams >= 1000 && grams % 1000 === 0) return `${grams / 1000} кг`;
    return `${grams} г`;
}

function ProductCardBase({
                             p,
                             priority = false,
                             onClick,
                             focused = false,
                             sizes,
                             imgProps,
                             titleTag: TitleTag = 'h5',
                         }) {
    const Tag = typeof onClick === 'function' ? 'button' : 'div';
    const imageKey = toImageKey(p);
    const weightLabel = formatWeight(p);
    const flavor = (p?.flavor || '').trim();

    return (
        <Tag
            className={[s.productCard, onClick ? s.clickable : '', focused ? s.focused : ''].filter(Boolean).join(' ')}
            onClick={onClick || undefined}
            type={onClick ? 'button' : undefined}
        >
            <div className={s.body}>
                <div className={s.media}>
                    <div className={s.mediaInner}>
                        {/* flavor badge */}
                        {flavor && <span className={s.flavorBadge}>{flavor}</span>}

                        <ProductImage
                            imageKey={imageKey}
                            alt={p?.name || 'Фото товару'}
                            basePath=""
                            placeholder="/images/products/"
                            fetchPriority={priority ? 'high' : 'auto'}
                            loading={priority ? 'eager' : 'lazy'}
                            decoding="async"
                            sizes={sizes}
                            {...imgProps}
                        />

                        {/* weight badge */}
                        {weightLabel && <span className={s.weightBadge}>{weightLabel}</span>}
                    </div>
                </div>

                <TitleTag className={s.title}>{p?.name}</TitleTag>
            </div>
        </Tag>
    );
}

export default memo(ProductCardBase);
