import React from 'react';
import BrandTile from './BrandTile';
import s from '../Products.module.scss';
import { toKebabKey } from '../utils/brandUtils';

export default function BrandGrid({
                                      brands = [],
                                      activeBrandKey = null,
                                      onToggleBrand,
                                      productCountByBrand = new Map(),
                                      resolveLogoSrc = (b) => b?.image || '',
                                  }) {
    if (!Array.isArray(brands) || brands.length === 0) return null;

    return (
        <div className={s.gridBrands} role="list" aria-label="Список брендів">
            {brands.map((b) => {
                const brandName = String(b?.name || '').trim();
                const brandKey  = b?.key || toKebabKey(brandName);
                const isOpen    = activeBrandKey === brandKey;
                const count     = productCountByBrand.get(brandKey) || 0;
                const logoSrc   = resolveLogoSrc(b);

                // якщо треба показувати тільки активний
                // if (activeBrandKey && !isOpen) return null;

                return (
                    <div className={s.brandCol} role="listitem" key={brandKey} data-brand-key={brandKey}>
                        <BrandTile
                            brand={{ key: brandKey, name: brandName }}
                            itemCount={count}
                            isOpen={isOpen}
                            logoSrc={logoSrc}
                            onToggle={() => onToggleBrand?.(brandKey)}
                        />
                    </div>
                );
            })}
        </div>
    );
}
