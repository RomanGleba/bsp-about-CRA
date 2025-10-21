const API = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

/**
 * Внутрішній JSON-хелпер.
 */
async function j(url, opts = {}) {
    if (!url) throw new Error('Missing URL');
    const r = await fetch(url, { mode: 'cors', ...opts });
    if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
    return r.json();
}

/**
 * fetchProducts({ signal? })
 * ---
 * Повертає масив продуктів з `${API}/products`.
 * Підтримує обидва формати відповіді:
 *  - старий: [ {...}, {...} ]
 *  - новий: { items: [ {...} ], total, page, ... }
 * Якщо API порожній або недоступний — повертає [].
 */
export async function fetchProducts(opts = {}) {
    const { signal } = opts;
    if (!API) return [];
    try {
        const data = await j(`${API}/products`, { signal });
        if (Array.isArray(data)) return data;               // старий формат
        if (data && Array.isArray(data.items)) return data.items; // новий формат з пагінацією
        return [];
    } catch (e) {
        console.warn('fetchProducts failed:', e);
        return [];
    }
}

/**
 * fetchBrands({ signal? })
 * ---
 * Повертає масив брендів з `${API}/brands`.
 * Якщо помилка — [].
 */
export async function fetchBrands(opts = {}) {
    const { signal } = opts;
    if (!API) return [];
    try {
        const data = await j(`${API}/brands`, { signal });
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.warn('fetchBrands failed:', e);
        return [];
    }
}
