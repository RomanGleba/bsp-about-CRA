// src/products/hooks/useProducts.js
import { useEffect, useState } from 'react';
import { fetchProducts, toImageKey } from '../../../api/products';
import catalogLocal from '../../../data/json/catalog.json';

function flattenLocalCatalog(catalog) {
    const out = [];
    for (const [brand, payload] of Object.entries(catalog || {})) {
        (payload?.products || []).forEach((p) => {
            out.push({
                id:    p.id,
                brand,
                name:  p.name,
                image: toImageKey(p.image),
            });
        });
    }
    return out;
}

function dedupeByKey(arr, keyFn) {
    const m = new Map();
    for (const item of arr) {
        const k = keyFn(item);
        if (!m.has(k)) m.set(k, item);
    }
    return Array.from(m.values());
}

export function useProducts() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        let alive = true;
        (async () => {
            const localFlat = flattenLocalCatalog(catalogLocal);

            try {
                const api = await fetchProducts();   // зараз поверне []
                const remote = Array.isArray(api) ? api : [];

                const merged = dedupeByKey(
                    [...remote, ...localFlat],
                    (x) => x.id || `${x.brand}::${x.name}`
                );

                if (alive) setItems(merged);
            } catch {
                if (alive) setItems(localFlat);
            }
        })();

        return () => { alive = false; };
    }, []);

    return items;
}
