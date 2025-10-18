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
 * Повертає масив продуктів тільки з `${API}/products`.
 * Якщо API порожній/недоступний/помилка — повертає [] без fallback.
 */
export async function fetchProducts(opts = {}) {
    const { signal } = opts;
    if (!API) return [];
    try {
        const arr = await j(`${API}/products`, { signal });
        return Array.isArray(arr) ? arr : [];
    } catch {
        return [];
    }
}

/**
 * fetchBrands({ signal? })
 * Повертає масив брендів тільки з `${API}/brands`.
 * Якщо помилка — [] без fallback.
 */
export async function fetchBrands(opts = {}) {
    const { signal } = opts;
    if (!API) return [];
    try {
        const arr = await j(`${API}/brands`, { signal });
        return Array.isArray(arr) ? arr : [];
    } catch {
        return [];
    }
}
