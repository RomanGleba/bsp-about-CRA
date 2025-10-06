import { useEffect, useMemo, useState } from 'react';
import { fetchBrands, fetchProducts } from '../../../api/products';
import { toKebabKey } from '../utils/brandUtils';

export function useBrands() {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        let alive = true;
        (async () => {
            // 1) пробуємо офіційний ендпоінт
            try {
                const data = await fetchBrands();
                if (!alive) return;
                if (Array.isArray(data) && data.length) {
                    setBrands(data);
                    return;
                }
            } catch {}

            // 2) fallback — збираємо бренди з продуктів
            try {
                const prods = await fetchProducts();
                if (!alive) return;
                const map = new Map();
                (prods || []).forEach(p => {
                    const name = (p.brand || '').trim();
                    if (!name) return;
                    const key = toKebabKey(name);
                    if (!map.has(key)) {
                        map.set(key, { id: null, name, image: p.brandImage || null }); // brandImage опціонально
                    }
                });
                setBrands(Array.from(map.values()));
            } catch {
                if (alive) setBrands([]);
            }
        })();
        return () => { alive = false; };
    }, []);

    return useMemo(() => {
        const unique = new Map();
        (brands || []).forEach(b => {
            const key = toKebabKey(b.name);
            if (!unique.has(key)) unique.set(key, { key, name:(b.name||'').trim(), image:b.image||null, id:b.id||null });
        });
        return Array.from(unique.values()).sort((a,b)=>a.name.localeCompare(b.name, 'uk'));
    }, [brands]);
}
