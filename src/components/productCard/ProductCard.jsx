import React, { useCallback, memo } from 'react';
import { Card, Typography } from 'antd';
import ProductImage from '../../ui/background/media/productImage/ProductImage';
import s from './ProductCard.module.scss';

const { Title } = Typography;

/**
 * Підійде для твоєї 4-в-ряд (lg), 3-в-ряд (md), 2-в-ряд (xs/sm) сітки.
 * Браузер сам вибере оптимальну ширину зображення.
 */
const DEFAULT_SIZES =
    '(min-width: 1200px) 25vw, (min-width: 768px) 33vw, 50vw';

function ProductCardBase({ p, priority = false, onClick }) {
    const interactive = !!onClick;

    const onKeyDown = useCallback((e) => {
        if (!interactive) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
        }
    }, [interactive, onClick]);

    return (
        <Card
            className={s.productCard}
            variant="outlined"
            role={interactive ? 'button' : 'group'}
            tabIndex={interactive ? 0 : -1}
            aria-label={p?.name || 'Картка товару'}
            onClick={onClick}
            onKeyDown={onKeyDown}
            hoverable={interactive}
            styles={{ body: { padding: 18 } }}
        >
            {/* Фіксуємо геометрію, щоб уникнути CLS */}
            <div className={s.media} aria-hidden="true" style={{ aspectRatio: '3 / 4' }}>
                <div className={s.mediaInner}>
                    <ProductImage
                        imageKey={p.image}
                        alt={p.name || 'Фото товару'}
                        basePath="/images/products"
                        // продуктивність
                        fetchPriority={priority ? 'high' : 'auto'}
                        loading={priority ? 'eager' : 'lazy'}
                        decoding="async"
                        // адаптивність (передай далі в <img sizes=..., srcSet=...> всередині ProductImage)
                        sizes={DEFAULT_SIZES}
                        // опційно: якщо ProductImage вміє, підкинь готові ширини
                        // srcSetWidths={[320, 480, 640, 800, 1000, 1400]}
                        // width/height (якщо ProductImage пробрасыває на <img>) — корисно для CLS
                        // width={800} height={1067}
                        // опційно: blur-плейсхолдер
                        // placeholder="blur" blurDataURL={p.previewBlurDataUrl}
                    />
                </div>
            </div>

            <Title level={5} className={s.title}>{p.name}</Title>
        </Card>
    );
}

const ProductCard = memo(ProductCardBase);
export default ProductCard;
