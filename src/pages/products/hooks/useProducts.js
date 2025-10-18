import { useEffect, useState } from 'react';
import { fetchProducts } from '../../../api/products';

/**
 * Завжди тягнемо лише з API.
 * Початковий стан: [].
 * У разі помилки — лишається [] (без fallback).
 */
export function useProducts() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        let alive = true;
        const ac = new AbortController();

        (async () => {
            try {
                const api = await fetchProducts({ signal: ac.signal });
                if (!alive) return;
                setItems(Array.isArray(api) ? api : []);
            } catch {
                if (alive) setItems([]); // без fallback
            }
        })();

        return () => {
            alive = false;
            ac.abort();
        };
    }, []);

    return items;
}
