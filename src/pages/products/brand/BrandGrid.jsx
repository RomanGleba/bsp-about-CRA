import React from 'react';
import BrandTile from './BrandTile';
import s from '../Products.module.scss';

export default function BrandGrid({
                                      brands,
                                      activeBrandKey,
                                      onToggleBrand,
                                      productCountByBrand,
                                      resolveLogoSrc,
                                  }) {
    return (
        <div className={s.gridBrands} role="list" aria-label="Список брендів">
            {brands.map((brand) => {
                const count = productCountByBrand.get(brand.key) || 0;
                const isOpen = activeBrandKey === brand.key;
                if (activeBrandKey && !isOpen) return null;

                return (
                    <div className={s.brandCol} role="listitem" key={brand.key} data-brand-key={brand.key}>
                        <BrandTile
                            brand={brand}
                            itemCount={count}
                            isOpen={isOpen}
                            logoSrc={resolveLogoSrc(brand)}
                            onToggle={() => onToggleBrand(brand.key)}
                        />
                    </div>
                );
            })}
        </div>
    );
}
