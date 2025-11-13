// src/products/hooks/useBrands.js
import { useEffect, useMemo, useState } from 'react';
import { fetchBrands, fetchProducts } from '../../../api/products';
import { toKebabKey } from '../utils/brandUtils';
import catalogLocal from '../../../data/json/catalog.json';
import brandsLocalRaw from '../../../data/json/Brends.json';

export function useBrands() {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        let alive = true;
        (async () => {
            // 1) спробувати офіційний ендпоінт
            try {
                const api = await fetchBrands();
                if (!alive) return;
                if (Array.isArray(api) && api.length) { setBrands(api); return; }
            } catch {}

            // 2) локальний brands файл (у тебе він з полем "brends")
            const brandsLocal = Array.isArray(brandsLocalRaw?.brends)
                ? brandsLocalRaw.brends.map(b => ({
                    id: b.id ?? null,
                    name: String(b.name || '').trim(),
                    image: b.image ?? null,        // якщо потрібно, можеш тут будувати "brands/<...>.webp"
                }))
                : [];

            if (brandsLocal.length) { setBrands(brandsLocal); return; }

            // 3) якщо навіть brands.local.json порожній — зібрати з продуктів
            try {
                const prods = await fetchProducts();
                if (!alive) return;
                const map = new Map();
                (prods || []).forEach(p => {
                    const name = (p.brand || '').trim();
                    if (!name) return;
                    const key = toKebabKey(name);
                    if (!map.has(key)) map.set(key, { id: null, name, image: null });
                });
                setBrands(Array.from(map.values()));
            } catch {
                // fallback на локальний каталог (ключі з catalog.local.json)
                const fromCatalog = Object.keys(catalogLocal || {}).map(name => ({
                    id: null, name, image: null
                }));
                setBrands(fromCatalog);
            }
        })();
        return () => { alive = false; };
    }, []);

    // нормалізація + сортування
    return useMemo(() => {
        const unique = new Map();
        (brands || []).forEach(b => {
            const key = toKebabKey(b.name);
            if (!unique.has(key)) unique.set(key, { key, name: (b.name || '').trim(), image: b.image || null, id: b.id || null });
        });
        return Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name, 'uk'));
    }, [brands]);
}
