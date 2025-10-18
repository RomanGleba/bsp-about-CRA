import React from 'react';
import s from './BrandGrid.module.scss';
import { toKebabKey } from '../utils/brandUtils';

/**
 * BrandGrid — відображає картки брендів з логотипом і кількістю товарів
 */
export default function BrandGrid({
                                      brands = [],
                                      activeBrandKey = null,
                                      onToggleBrand,
                                      productCountByBrand = new Map(),
                                      resolveLogoSrc,
                                  }) {
    if (!brands.length) {
        return <div className={s.empty}>Поки немає брендів</div>;
    }

    return (
        <div className={s.grid}>
            {brands.map((b) => {
                const brandName = String(b?.name || '').trim();
                const brandKey = toKebabKey(brandName);
                const isActive = activeBrandKey === brandKey;
                const count = productCountByBrand.get(brandKey) || 0;
                const logoSrc = resolveLogoSrc ? resolveLogoSrc(b) : (b?.image || '');

                return (
                    <div
                        key={brandKey || brandName}
                        className={[s.card, isActive ? s.active : ''].join(' ')}
                        onClick={() => onToggleBrand?.(brandKey)}
                    >
                        <div className={s.media}>
                            {logoSrc ? (
                                <img src={logoSrc} alt={brandName} />
                            ) : (
                                <div className={s.placeholder}>No logo</div>
                            )}
                        </div>

                        <div className={s.body}>
                            <div className={s.title}>{brandName}</div>
                            <div className={s.cta}>
                                {isActive ? 'Згорнути' : `Дивитися (${count})`}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
