import React, { useMemo, useState, useCallback } from 'react';
import { Row, Col, Divider } from 'antd';
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

/* ===== LOGO MAP (webpack require.context замість Vite import.meta.glob) =====
   Папка з логотипами має бути: src/assets/brands/*
   Якщо у тебе інший шлях — підправ нижче відносний шлях в require.context.
*/
const logoUrlByKey = (() => {
    // якщо немає jsconfig.json з baseUrl=src — тримаємо відносний шлях:
    const ctx = require.context('../../assets/brands', false, /\.(png|jpe?g|webp|svg)$/);
    const map = {};
    ctx.keys().forEach((k) => {
        // приклад k: './Epicentrk.svg'
        const file = k.replace('./', '');
        const key  = normKey(file.replace(/\.(png|jpe?g|webp|svg)$/i, ''));
        map[key] = ctx(k); // webpack повертає url
    });
    return map;
})();

/* Резолвер src для зображення бренду */
const resolveBrandSrc = (brand) => {
    const keyFromName = normKey(brand.name);
    const img = (brand.image || '').trim();

    // Якщо у brand.image лежить "короткий" ключ без розширення → шукаємо в src/assets/brands або даємо фолбек у public/
    if (img && !isAbs(img) && !hasExt(img)) {
        const k = normKey(img);
        return logoUrlByKey[k] || `${process.env.PUBLIC_URL}/images/brands/${k}.webp`;
    }

    // Якщо brand.image вже абсолютний шлях або з розширенням — віддаємо як є
    if (img) return img;

    // Інакше пробуємо за назвою бренду
    return logoUrlByKey[keyFromName] || `${process.env.PUBLIC_URL}/images/brands/${keyFromName}.webp`;
};

const VISIBLE_STEP = 8;

export default function Products() {
    const { t } = useTranslation();

    // перетворюємо { Brand: { products: [...] } } у плоский список
    const items = useMemo(() => {
        if (!productsData) return [];
        const all = [];
        for (const [brandName, data] of Object.entries(productsData)) {
            const products = data?.products || [];
            for (const p of products) {
                all.push({ ...p, brand: brandName });
            }
        }
        return all;
    }, []); // productsData імпорт з файлу — стабільний, deps не потрібні

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
                mobileWebp="/images/backgrounds/mobile/more-dogs.webp"
                mobileJpg="/images/backgrounds/mobile/dogs.jpg"
                tabletWebp="/images/backgrounds/tablet/more-dogs.webp"
                tabletJpg="/images/backgrounds/tablet/dogs.jpg"
                desktopWebp="/images/backgrounds/desktop/more-dogs.webp"
                desktopJpg="/images/backgrounds/desktop/dogs.jpg"
                alt={t('products.bannerAlt', { defaultValue: 'Корм для улюбленців' })}

                height="clamp(340px, 56vh, 600px)"
                overlay="linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.25))"
                className={s.bannerFull}
                positionDesktop="50% 32%"
                positionTablet="50% 40%"
                positionMobile="50% 48%"
            >
                <div className={s.bannerContent}>
                    <h1 className={s.bannerTitle}>{t('products.title', { defaultValue: 'Наша продукція' })}</h1>
                    <p className={s.bannerLead}>{t('products.lead', { defaultValue: 'Ми імпортуємо та дистриб’юємо якісні товари для ваших улюбленців.' })}</p>
                </div>
            </ResponsiveBanner>


            <div className={s.container}>
                <Divider orientation="left">
                    {t('brands.all', { defaultValue: 'Продукція' })}
                </Divider>

                {/* Сітка брендів */}
                <Row
                    gutter={[
                        { xs: 12, sm: 18, md: 28 }, // горизонтальний
                        { xs: 16, sm: 22, md: 28 }, // вертикальний
                    ]}
                    role="list"
                    aria-label={t('brands.all', { defaultValue: 'Список брендів' })}
                >
                    {brands.map((b, i) => {
                        const imgSrc = resolveBrandSrc(b);
                        const count  = countByBrand.get(b.key) || 0;
                        const open   = openBrandKey === b.key;

                        const openThis = () => toggleBrand(b.key);
                        const onKey = (e) => {
                            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openThis(); }
                        };

                        return (
                            <React.Fragment key={b.key || b.id || i}>
                                <Col xs={12} sm={12} md={8} lg={6} role="listitem">
                                    <button
                                        type="button"
                                        className={`${s.brandTile} ${open ? s.active : ''}`}
                                        onClick={openThis}
                                        onKeyDown={onKey}
                                        aria-expanded={open}
                                        aria-controls={`brand-products-${i}`}
                                        aria-label={`Відкрити бренд ${b.name}. ${count ? `Товарів: ${count}.` : 'Немає товарів.'}`}
                                    >
                                        <div className={s.brandMedia} aria-hidden={true}>
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
                                                {count > 0 && <span className={s.countPill}>Дивитися ({count})</span>}
                                            </div>
                                            <span className={s.chev} aria-hidden="true">›</span>
                                        </div>
                                    </button>
                                </Col>

                                {open && (
                                    <Col xs={24} className={`${s.brandProducts} ${s.expanded}`} id={`brand-products-${i}`}>
                                        <Row gutter={[{ xs: 12, sm: 18, md: 28 }, { xs: 16, sm: 22, md: 28 }]}>
                                            {visibleProducts.map((p, k) => (
                                                <Col key={p.id || p.image || k} xs={12} sm={8} lg={6}>
                                                    <ProductCard p={p} priority={k < 4} />
                                                </Col>
                                            ))}
                                        </Row>

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
                                    </Col>
                                )}
                            </React.Fragment>
                        );
                    })}
                </Row>
            </div>
        </section>
    );
}
