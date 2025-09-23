import React from 'react';
import s from '../Products.module.scss';

/**
 * Clickable brand tile with logo, name and count pill.
 */
export default function BrandTile({ brand, itemCount, isOpen, logoSrc, onToggle }) {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); }
    };

    const ariaLabel = isOpen
        ? `Згорнути бренд ${brand.name}.`
        : `Відкрити бренд ${brand.name}. ${itemCount ? `Товарів: ${itemCount}.` : 'Немає товарів.'}`;

    return (
        <button
            type="button"
            className={`${s.brandTile} ${isOpen ? s.active : ''}`}
            onClick={onToggle}
            onKeyDown={handleKeyDown}
            aria-expanded={isOpen}
            aria-controls={`brand-products-${brand.key}`}
            aria-label={ariaLabel}
        >
            <div className={s.brandMedia} aria-hidden="true">
                <img
                    src={logoSrc}
                    alt={brand.name}
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
                    <div className={s.brandName} title={brand.name}>{brand.name}</div>
                    <span className={s.countPill}>
            {isOpen ? 'Згорнути' : `Дивитися (${itemCount})`}
          </span>
                </div>
                <span className={s.chev} aria-hidden="true">›</span>
            </div>
        </button>
    );
}
