const API      = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');
const CATALOG  = (process.env.REACT_APP_PRODUCTS_CATALOG || '').trim();
const BRANDS   = (process.env.REACT_APP_BRANDS_INDEX || '').trim();

async function j(url) {
    const r = await fetch(url, { mode: 'cors' });
    if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
    return r.json();
}
const hasExt   = (s='') => /\.[a-z0-9]+$/i.test(s);
const strip    = (s='') => String(s).replace(/^\/+/, '');

export async function fetchProducts() {
    // 1) спробувати API якщо є
    try {
        if (API) {
            const arr = await j(`${API}/products`);
            if (Array.isArray(arr) && arr.length) return arr;
        }
    } catch {}

    // 2) fallback – твій S3/CF JSON (об'єкт { Brand: {products:[...]}, ... })
    if (!CATALOG) return [];
    const raw = await j(CATALOG);

    if (Array.isArray(raw)) return raw; // на випадок якщо колись стане масивом

    const out = [];
    for (const [brand, group] of Object.entries(raw || {})) {
        (group?.products || []).forEach(p => {
            const img = strip(p.image || '');                 // "dasty/dasty-banka"
            const key = hasExt(img) ? img : `${img}.webp`;    // "dasty/dasty-banka.webp"
            out.push({
                id: p.id,
                brand,
                name: p.name,
                images: [{ key: `products/${key}` }],           // <= те, що чекає ProductCard/ProductImage
            });
        });
    }
    return out;
}

export async function fetchBrands() {
    try {
        if (API) {
            const arr = await j(`${API}/brands`);
            if (Array.isArray(arr) && arr.length) return arr;
        }
    } catch {}

    if (!BRANDS) return [];
    const raw = await j(BRANDS);
    const arr =
        Array.isArray(raw?.brands) ? raw.brands :
            Array.isArray(raw?.brends) ? raw.brends :
                Array.isArray(raw) ? raw : [];

    return arr.map(b => ({
        id: b.id ?? null,
        name: String(b.name || '').trim(),
        image: b.image ?? null,
    }));
}
