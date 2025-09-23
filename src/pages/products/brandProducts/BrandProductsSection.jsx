import React from 'react';
import ProductGrid from './ProductGrid';
import PaginationButtons from './PaginationButtons';
import s from '../Products.module.scss';

export default function BrandProductsSection({
                                                 sectionId,
                                                 products,
                                                 visibleProducts,
                                                 pageSize,
                                                 onShowMore,
                                                 onShowAll,
                                                 onCollapse,
                                                 ProductCardComponent,
                                             }) {
    return (
        <div className={`${s.brandProducts} ${s.expanded}`} id={sectionId}>
            <ProductGrid products={visibleProducts} ProductCard={ProductCardComponent} />

            {products.length > visibleProducts.length && (
                <PaginationButtons variant="more" onShowMore={onShowMore} onShowAll={onShowAll} />
            )}

            {visibleProducts.length > pageSize && (
                <PaginationButtons variant="collapse" onCollapse={onCollapse} />
            )}
        </div>
    );
}
