// src/api/products.js

/**
 * Тут ми НЕ використовуємо жодні API-запити.
 * Каталог і бренди будуть тільки локальні (з /src/data/json/).
 * fetchProducts() і fetchBrands() повертають порожні масиви.
 */

const hasExt = (s = '') => /\.[a-z0-9]+$/i.test(s);
const strip  = (s = '') => String(s).replace(/^\/+/, '');

/**
 * Конвертація локального image поля → S3/CloudFront imageKey
 * "dasty/dasty-banka" → "products/dasty/dasty-banka.webp"
 */
export function toImageKey(raw = '') {
    const img = strip(raw);
    if (!img) return '';

    let key = /^(products|brands)\//i.test(img)
        ? img
        : `products/${img}`;

    if (!hasExt(key)) key += '.webp';

    return key;
}

/**
 * fetchProducts — повністю відключено.
 * Бекенд нам не потрібний. Дані приходять із локального catalog.json
 */
export async function fetchProducts() {
    return [];  // ❗ важливо: повертаємо пустий масив, щоб useProducts() взяв локалку
}

/**
 * fetchBrands — теж відключено.
 * Бренди будуть з локального brands.json, якщо треба,
 * або поки що просто не використовуються.
 */
export async function fetchBrands() {
    return [];
}
