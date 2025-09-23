// hooks/useProductCountByBrand.js
import { useMemo } from 'react';
import { toKebabKey } from '../utils/brandUtils';

/**
 * Hook: count how many products belong to each brand
 * @param {Array} products - flat array of products with { brand }
 * @returns {Map<string, number>} brandKey -> count
 */
export function useProductCountByBrand(products) {
    return useMemo(() => {
        const map = new Map();
        for (const product of products) {
            const key = toKebabKey(product.brand);
            map.set(key, (map.get(key) || 0) + 1);
        }
        return map;
    }, [products]);
}
