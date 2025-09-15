import React, { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import productsData from '../../data/json/Products.json';
import brandsData   from '../../data/json/Brends.json';
import ProductCard  from '../../components/productCard/ProductCard';
import ResponsiveBanner from '../../ui/background/ResponsiveBanner';
import s from './Products.module.scss';

/* ===== helpers ===== */
const normKey = (v) => (v ?? '').toString().trim().toLowerCase().replace(/\s+/g, '-');
const hasExt  = (s='') => /\.[a-z0-9]+$/i.test(s);
const isAbs   = (s='') => /^\/|^https?:\/\//i.test(s);

/* ===== LOGO MAP (webpack require.context) ===== */
const logoUrlByKey = (() => {
    const ctx = require.context('../../assets/brands', false, /\.(png|jpe?g|webp|svg)$/);
    const map = {};
    ctx.keys().forEach((k) => {
        const file = k.replace('./', '');
        const key  = normKey(file.replace(/\.(png|jpe?g|webp|svg)$/i, ''));
        map[key] = ctx(k);
    });
    return map;
})();

/* Резолвер src для зображення бренду */
const resolveBrandSrc = (brand) => {
    const keyFromName = normKey(brand.name);
    const img = (brand.image || '').trim();

    if (img && !isAbs(img) && !hasExt(img)) {
        const k = normKey(img);
        return logoUrlByKey[k] || `${process.env.PUBLIC_URL}/images/brands/${k}.webp`;
    }
    if (img) return img;

    return logoUrlByKey[keyFromName] || `${process.env.PUBLIC_URL}/images/brands/${keyFromName}.webp`;
};

const VISIBLE_STEP = 8;

export default function Products() {
    const { t } = useTranslation();

    // згортаємо { Brand: { products: [...] } } у масив
    const items = useMemo(() => {
        if (!productsData) return [];
        const all = [];
        for (const [brandName, data] of Object.entries(productsData)) {
            const products = data?.products || [];
            for (const p of products) all.push({ ...p, brand: brandName });
        }
        return all;
    }, []);

    /* карта кількості товарів на бренд */
    const countByBrand = useMemo(() => {
        const m = new Map();
        for (const p of items) {
            const k = normKey(p.brand);
            m.set(k, (m.get(k) || 0) + 1);
        }
        return m;
    }, [items]);

    /* унікальні бренди */
    const brands = useMemo(() => {
        const list = (brandsData?.brends || []).map((b) => ({
            key:   normKey(b.name),
            name:  (b.name ?? '').trim(),
            image: b.image || null,
            id:    b.id || null,
        }));
        const map = new Map();
        for (const b of list) if (!map.has(b.key)) map.set(b.key, b);
        return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, 'uk'));
    }, []);

    const [openBrandKey, setOpenBrandKey] = useState(null);
    const [visibleByBrand, setVisibleByBrand] = useState({}); // { [brandKey]: number }

    const toggleBrand = useCallback((key) => {
        setOpenBrandKey((cur) => {
            const next = cur === key ? null : key;
            if (next) setVisibleByBrand((m) => (m[next] ? m : { ...m, [next]: VISIBLE_STEP }));
            return next;
        });
    }, []);

    const showAllBrands = () => setOpenBrandKey(null);

    /* товари активного бренду */
    const productsByOpenBrand = useMemo(() => {
        if (!openBrandKey) return [];
        return items.filter((p) => normKey(p.brand) === openBrandKey);
    }, [items, openBrandKey]);

    const visibleCount    = visibleByBrand[openBrandKey] ?? 0;
    const visibleProducts = openBrandKey
        ? productsByOpenBrand.slice(0, visibleCount || VISIBLE_STEP)
        : [];

    const showMore = () =>
        setVisibleByBrand((m) => ({
            ...m,
            [openBrandKey]: Math.min((m[openBrandKey] || VISIBLE_STEP) + VISIBLE_STEP, productsByOpenBrand.length),
        }));
    const showAll = () =>
        setVisibleByBrand((m) => ({ ...m, [openBrandKey]: productsByOpenBrand.length }));
    const collapse = () =>
        setVisibleByBrand((m) => ({ ...m, [openBrandKey]: VISIBLE_STEP }));

    return (
        <section className={s.section}>
            <ResponsiveBanner
                webp="/images/backgrounds/more-dogs.webp"
                jpg="/images/backgrounds/more-dogs.jpg"
                alt={t('products.bannerAlt', { defaultValue: 'Корм для улюбленців' })}

                height="clamp(340px, 56vh, 600px)"
                overlay="linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.25))"
                className={s.bannerFull}
                position="50% 35%"   // одне значення для всіх пристроїв
            >
                <div className={s.bannerContent}>
                    <h1 className={s.bannerTitle}>
                        {t('products.title', { defaultValue: 'Наша продукція' })}
                    </h1>
                    <p className={s.bannerLead}>
                        {t('products.lead', {
                            defaultValue: 'Ми імпортуємо та дистриб’юємо якісні товари для ваших улюбленців.'
                        })}
                    </p>
                </div>
            </ResponsiveBanner>


            <div className={s.container}>
                <div className={s.divider} role="separator" aria-label={t('brands.all', { defaultValue: 'Продукція' })}>
          <span className={s.dividerText}>
            {openBrandKey
                ? t('brands.selected', { defaultValue: 'Вибраний бренд' })
                : t('brands.all', { defaultValue: 'Продукція' })}
          </span>

                    {openBrandKey && (
                        <div className={s.backWrap}>
                            <button
                                type="button"
                                className={s.backBtn}
                                onClick={() => setOpenBrandKey(null)}
                            >
                                Повернути всі бренди
                            </button>
                        </div>
                    )}

                </div>

                {/* Сітка брендів: якщо є відкритий — ховаємо інші */}
                <div className={s.gridBrands} role="list" aria-label={t('brands.all', { defaultValue: 'Список брендів' })}>
                    {brands.map((b, i) => {
                        const imgSrc = resolveBrandSrc(b);
                        const count  = countByBrand.get(b.key) || 0;
                        const open   = openBrandKey === b.key;

                        const openThis = () => toggleBrand(b.key);
                        const onKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openThis(); } };

                        // 👇 головна логіка: якщо один бренд відкритий — не показуємо інші
                        const hidden = openBrandKey && !open;
                        if (hidden) return null;

                        return (
                            <React.Fragment key={b.key || b.id || i}>
                                <div className={s.brandCol} role="listitem">
                                    <button
                                        type="button"
                                        className={`${s.brandTile} ${open ? s.active : ''}`}
                                        onClick={openThis}
                                        onKeyDown={onKey}
                                        aria-expanded={open}
                                        aria-controls={`brand-products-${i}`}
                                        aria-label={
                                            open
                                                ? `Згорнути бренд ${b.name}.`
                                                : `Відкрити бренд ${b.name}. ${count ? `Товарів: ${count}.` : 'Немає товарів.'}`
                                        }
                                    >
                                        <div className={s.brandMedia} aria-hidden="true">
                                            <img
                                                src={imgSrc}
                                                alt={b.name}
                                                className={s.brandMediaImg}
                                                loading="lazy"
                                                decoding="async"
                                                onError={(e) => {
                                                    const el = e.currentTarget; el.onerror = null;
                                                    if (/\.webp($|\?)/i.test(el.src)) { el.src = el.src.replace(/\.webp/i, '.png'); return; }
                                                    if (/\.png($|\?)/i.test(el.src))  { el.src = el.src.replace(/\.png/i,  '.jpg'); return; }
                                                    el.src = `${process.env.PUBLIC_URL}/images/brands/placeholder.webp`;
                                                }}
                                            />
                                        </div>

                                        <div className={s.brandInfo}>
                                            <div className={s.brandNameRow}>
                                                <div className={s.brandName} title={b.name}>{b.name}</div>
                                                <span className={s.countPill}>
                          {open ? 'Згорнути' : `Дивитися (${count})`}
                        </span>
                                            </div>
                                            <span className={s.chev} aria-hidden="true">›</span>
                                        </div>
                                    </button>
                                </div>

                                {open && (
                                    <div className={`${s.brandProducts} ${s.expanded}`} id={`brand-products-${i}`}>
                                        <div className={s.gridProducts}>
                                            {visibleProducts.map((p, k) => (
                                                <div key={p.id || p.image || k} className={s.productCol}>
                                                    <ProductCard p={p} priority={k < 4} />
                                                </div>
                                            ))}
                                        </div>

                                        {productsByOpenBrand.length > visibleProducts.length && (
                                            <div className={s.loadMoreWrap}>
                                                <button type="button" className={s.loadMoreBtn} onClick={showMore}>Показати ще</button>
                                                <button type="button" className={s.showAllBtn}  onClick={showAll}>Показати всі</button>
                                            </div>
                                        )}

                                        {visibleProducts.length > VISIBLE_STEP && (
                                            <div className={s.collapseWrap}>
                                                <button type="button" className={s.collapseBtn} onClick={collapse}>Згорнути</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
