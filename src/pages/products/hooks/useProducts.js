// src/products/hooks/useProducts.js
import { useEffect, useState } from 'react';
import { fetchProducts } from '../../../api/products';
import catalogLocal from '../../../data/json/catalog.json';

const hasExt = (s='') => /\.[a-z0-9]+$/i.test(s);

function flattenLocalCatalog(catalog) {
    // catalog: { "Cattos": { products:[{id,name,image}, ...] }, ... }
    const out = [];
    for (const [brand, payload] of Object.entries(catalog || {})) {
        (payload?.products || []).forEach(p => {
            const img = String(p.image || '').trim();           // "cattos/cattos-chicken-banka"
            const keyPart = hasExt(img) ? img : `${img}.webp`;  // "cattos/cattos-chicken-banka.webp"
            out.push({
                id: p.id,
                brand,                                            // <-- важливо для фільтрації за брендом
                name: p.name,
                images: [{ key: `products/${keyPart}` }],         // <-- те, що чекає ProductCard
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
            const localFlat = flattenLocalCatalog(catalogLocal); // локальний базовий каталог
            try {
                const api = await fetchProducts();                 // очікуємо масив
                const remote = Array.isArray(api) ? api : [];
                // Зливаємо: пріоритет у API (оновлення через адмінку)
                const merged = dedupeByKey(
                    [...remote, ...localFlat],
                    (x) => x.id || `${x.brand}::${x.name}`           // ключ для унікальності
                );
                if (alive) setItems(merged);
            } catch {
                if (alive) setItems(localFlat);                    // немає API → показуємо локалку
            }
        })();
        return () => { alive = false; };
    }, []);

    return items;
}
