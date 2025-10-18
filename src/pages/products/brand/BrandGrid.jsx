import React from 'react';
import s from './BrandGrid.module.scss';
import { toKebabKey } from '../utils/brandUtils'

/**
 * Відображає всі бренди з лічильником продуктів
 */
export default function BrandGrid({
                                      brands = [],
                                      activeBrandKey = null,
                                      onToggleBrand,
                                      productCountByBrand = new Map(),
                                      resolveLogoSrc,
                                  }) {
    return (
        <div className={s.grid}>
            {brands.map((b) => {
                const brandName = String(b?.name || '').trim();
                const brandKey  = toKebabKey(brandName);
                const isActive  = activeBrandKey === brandKey;
                const count     = productCountByBrand.get(brandKey) || 0;
                const logoSrc   = resolveLogoSrc ? resolveLogoSrc(b) : (b?.image || '');

                return (
                    <button
                        key={brandKey || brandName}
                        type="button"
                        className={[s.card, isActive ? s.active : ''].join(' ')}
                        onClick={() => onToggleBrand?.(brandKey)}
                        data-brand-key={brandKey}
                    >
                        <div className={s.media}>
                            {logoSrc ? (
                                <img src={logoSrc} alt={brandName} />
                            ) : (
                                <div className={s.logoStub} />
                            )}
                        </div>

                        <div className={s.body}>
                            <div className={s.title}>{brandName}</div>
                            <div className={s.cta}>
                                {isActive ? 'Згорнути' : `Дивитися (${count})`}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
