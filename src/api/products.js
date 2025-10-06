// src/api/products.js
const API_BASE = (
    process.env.REACT_APP_PUBLIC_API_URL ||
    process.env.REACT_APP_API_URL ||
    ''
).replace(/\/+$/, '');

async function jsonFetch(path, opts = {}) {
    if (!API_BASE) {
        throw new Error('REACT_APP_PUBLIC_API_URL або REACT_APP_API_URL не задано');
    }
    const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
    const res = await fetch(url, {
        method: opts.method || 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(opts.headers || {}),
        },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        mode: 'cors',
        credentials: 'omit',
    });
    if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || `HTTP ${res.status} ${url}`);
    }
    return res.json();
}

function normImage(x) {
    if (!x) return null;
    const url = x.url || x.src || '';
    if (!url) return null;
    return {
        id: x.id || x.key || url,
        key: x.key || x.id || null,
        url,
    };
}

function normProduct(p) {
    return {
        id: String(p?.id ?? ''),
        title: String(p?.title ?? '').trim(),
        description: p?.description ?? '',
        brand: String(p?.brand ?? '').trim(),
        // сайт може юзати priceCents; якщо бек не дає — лишаємо undefined
        priceCents: typeof p?.priceCents === 'number' ? p.priceCents : undefined,
        // якщо у вас вага — теж прокинемо, фронт може ігнорити
        weightGrams: typeof p?.weightGrams === 'number' ? p.weightGrams : undefined,
        images: Array.isArray(p?.images) ? p.images.map(normImage).filter(Boolean) : [],
    };
}

function normBrand(b) {
    return {
        id: b?.id ?? null,
        name: String(b?.name ?? '').trim(),
        image: b?.image || null,
    };
}

export async function fetchProducts() {
    const data = await jsonFetch('/products');
    return Array.isArray(data) ? data.map(normProduct) : [];
}

export async function fetchBrands() {
    const data = await jsonFetch('/brands');
    return Array.isArray(data) ? data.map(normBrand) : [];
}
