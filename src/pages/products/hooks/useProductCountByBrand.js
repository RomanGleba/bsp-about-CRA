import { useMemo } from 'react';
import { toKebabKey } from '../utils/brandUtils';

/**
 * Підраховує кількість продуктів для кожного бренду
 * products: [{ brand: 'Dasty', ... }]
 * повертає Map: { dasty -> 1, dwd -> 2 }
 */
export function useProductCountByBrand(products) {
    return useMemo(() => {
        const map = new Map();
        for (const product of products || []) {
            const brand = String(product?.brand || '').trim(); // ✅ прибираємо пробіли
            const key = toKebabKey(brand);
            if (!key) continue;
            map.set(key, (map.get(key) || 0) + 1);
        }
        return map;
    }, [products]);
}
