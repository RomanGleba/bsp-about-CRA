import { useMemo } from 'react';
import productsData from '../../../data/json/Products.json';

import { toKebabKey } from '../utils/brandUtils';

export function useProducts() {
    return useMemo(() => {
        if (!productsData) return [];
        const all = [];
        for (const [brandName, data] of Object.entries(productsData)) {
            (data?.products || []).forEach((p) => all.push({ ...p, brand: brandName }));
        }
        return all;
    }, []);
}

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
