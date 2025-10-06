import React, { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import ProductCard from './productCard/ProductCard';
import ResponsiveBanner from '../../ui/background/ResponsiveBanner';
import BackgroundImageOne from '../../ui/background/BackgroundImage';

import DividerBar from './ui/DividerBar';
import BackButton from './ui/BackButton';
import BrandGrid from './brand/BrandGrid';
import BrandProductsSection from './brandProducts/BrandProductsSection';

import { toKebabKey, resolveBrandLogoSrc } from './utils/brandUtils';
import { useProducts, useProductCountByBrand } from './hooks/useProducts';
import { useBrands } from './hooks/useBrands';
import { backgrounds } from '../../data/backgrounds';

import s from './Products.module.scss';


const PAGE_SIZE = 8;

export default function Products() {
    const { t } = useTranslation();

    const products = useProducts();
    const productCountByBrand = useProductCountByBrand(products);
    const brands = useBrands();

    const [activeBrandKey, setActiveBrandKey] = useState(null);
    const [visibleCountByBrand, setVisibleCountByBrand] = useState({});

    const handleToggleBrand = useCallback(
        (brandKey) => {
            setActiveBrandKey((current) => {
                const next = current === brandKey ? null : brandKey;
                if (next && !visibleCountByBrand[next]) {
                    setVisibleCountByBrand((prev) => ({ ...prev, [next]: PAGE_SIZE }));
                }
                requestAnimationFrame(() => {
                    document
                        .querySelector(`[data-brand-key="${next}"]`)
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
                return next;
            });
        },
        [visibleCountByBrand]
    );

    const handleResetToAllBrands = () => setActiveBrandKey(null);

    const productsByActiveBrand = useMemo(() => {
        if (!activeBrandKey) return [];
        return products.filter((p) => toKebabKey(p.brand) === activeBrandKey);
    }, [products, activeBrandKey]);

    const visibleCount = visibleCountByBrand[activeBrandKey] ?? 0;
    const visibleProducts = activeBrandKey
        ? productsByActiveBrand.slice(0, visibleCount || PAGE_SIZE)
        : [];

    const handleShowMore = () =>
        setVisibleCountByBrand((m) => ({
            ...m,
            [activeBrandKey]: Math.min(
                (m[activeBrandKey] || PAGE_SIZE) + PAGE_SIZE,
                productsByActiveBrand.length
            ),
        }));

    const handleShowAll = () =>
        setVisibleCountByBrand((m) => ({
            ...m,
            [activeBrandKey]: productsByActiveBrand.length,
        }));

    const handleCollapse = () =>
        setVisibleCountByBrand((m) => ({
            ...m,
            [activeBrandKey]: PAGE_SIZE,
        }));

    const sectionClass = `${s.section} ${activeBrandKey ? s.focusMode : ''}`;
    const containerClass = `${s.container} ${activeBrandKey ? s.focusContainer : ''}`;

    return (
        <section className={sectionClass}>
            {/* Фонове зображення лапок */}
            <BackgroundImageOne {...backgrounds.products} className={s.bgImage} />

            {/* м’який шар */}
            <div className={s.softOverlay} aria-hidden />

            {/* Банер */}
            <ResponsiveBanner
                webp="/images/backgrounds/dogs-forest.webp"
                jpg="/images/backgrounds/more-dogs.jpg"
                alt={t('products.bannerAlt', { defaultValue: 'Корм для улюбленців' })}
                height="clamp(340px, 56vh, 600px)"
                overlay="linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.25))"
                className={s.bannerFull}
                position="50% 35%"
            >
                <div className={s.bannerContent}>
                    <h1 className={s.bannerTitle}>
                        {t('products.title', { defaultValue: 'Наша продукція' })}
                    </h1>
                    <p className={s.bannerLead}>
                        {t('products.lead', {
                            defaultValue:
                                'Ми імпортуємо та дистриб’юємо якісні товари для ваших улюбленців.',
                        })}
                    </p>
                </div>
            </ResponsiveBanner>

            <div className={containerClass}>
                <DividerBar
                    label={
                        activeBrandKey
                            ? t('brands.selected', { defaultValue: 'Вибраний бренд' })
                            : t('brands.all', { defaultValue: 'Продукція' })
                    }
                >
                    {activeBrandKey && (
                        <BackButton onClick={handleResetToAllBrands} label="Повернути всі бренди" />
                    )}
                </DividerBar>

                <BrandGrid
                    brands={brands}
                    activeBrandKey={activeBrandKey}
                    onToggleBrand={handleToggleBrand}
                    productCountByBrand={productCountByBrand}
                    resolveLogoSrc={resolveBrandLogoSrc}
                />

                {activeBrandKey && (
                    <BrandProductsSection
                        sectionId={`brand-products-${activeBrandKey}`}
                        products={productsByActiveBrand}
                        visibleProducts={visibleProducts}
                        pageSize={PAGE_SIZE}
                        onShowMore={handleShowMore}
                        onShowAll={handleShowAll}
                        onCollapse={handleCollapse}
                        ProductCardComponent={ProductCard}
                    />
                )}
            </div>
        </section>
    );
}
