import { useEffect, useState } from 'react';
import { fetchBrands } from '../../../api/products';

/**
 * Тільки API. Якщо ендпоінт недоступний або повернув «не масив» — віддаємо [].
 */
export function useBrands() {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        let alive = true;
        const ac = new AbortController();

        (async () => {
            try {
                const api = await fetchBrands({ signal: ac.signal });
                if (!alive) return;
                setBrands(Array.isArray(api) ? api : []);
            } catch {
                if (alive) setBrands([]); // без fallback
            }
        })();

        return () => {
            alive = false;
            ac.abort();
        };
    }, []);

    return brands;
}
