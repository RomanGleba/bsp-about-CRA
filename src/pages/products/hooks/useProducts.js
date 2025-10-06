import { useEffect, useMemo, useState } from 'react';
import { fetchProducts } from '../../../api/products';
import { toKebabKey } from '../utils/brandUtils';

export function useProducts() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const data = await fetchProducts();
                if (!alive) return;
                // очікуємо: { id, title, description, priceCents, brand, images:[{id,key,url}] }
                setItems(Array.isArray(data) ? data : []);
            } catch {
                if (alive) setItems([]);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, []);

    return items;
}

export function useProductCountByBrand(products) {
    return useMemo(() => {
        const map = new Map();
        for (const p of products) {
            const key = toKebabKey(p.brand);
            map.set(key, (map.get(key) || 0) + 1);
        }
        return map;
    }, [products]);
}
