import React from 'react';
import s from '../Products.module.scss';

/**
 * Renders a grid of product cards.
 * @param {Array}  products - visible products to render
 * @param {React}  ProductCard - component to render a single product (passed from parent)
 */
export default function ProductGrid({ products, ProductCard }) {
    return (
        <div className={s.gridProducts}>
            {products.map((product, idx) => (
                <div key={product.id || product.image || idx} className={s.productCol}>
                    <ProductCard p={product} priority={idx < 4} />
                </div>
            ))}
        </div>
    );
}
