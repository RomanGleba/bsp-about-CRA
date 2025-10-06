// src/pages/products/utils/brandUtils.js
export const toKebabKey = (v) =>
    (v ?? '').toString().trim().toLowerCase().replace(/\s+/g, '-');

const CDN = (process.env.REACT_APP_CDN_BASE_URL || '').replace(/\/+$/, '');
const hasExt = (s = '') => /\.[a-z0-9]+$/i.test(s);
const isAbs  = (s = '') => /^https?:\/\//i.test(s) || s.startsWith('/');
const strip  = (s = '') => String(s).replace(/^\/+/, '');

/**
 * Будуємо src для логотипа бренду з урахуванням CDN.
 * Підтримує варіанти:
 *  - brand.image = абсолютний URL → повертаємо як є
 *  - brand.image = "brands/dasty-fon.webp" або "products/..." → CDN + цей шлях
 *  - brand.image = "dasty-fon" (без розширення/шляху) → CDN + "brands/dasty-fon.webp"
 *  - brand.image відсутній → CDN + "brands/<brand-name-kebab>.webp"
 */
export const resolveBrandLogoSrc = (brand = {}) => {
    const nameKey = toKebabKey(brand.name || '');
    let img = strip(brand.image || '');

    if (isAbs(img)) return img;

    // якщо вказали ключ зі шляхом
    if (img) {
        if (/^(brands|products)\//i.test(img)) {
            const key = hasExt(img) ? img : `${img}.webp`;
            return CDN ? `${CDN}/${key}` : `/${key}`;
        }
        // якщо дали лише ім'я файлу без розширення/шляху
        const file = hasExt(img) ? img : `${img}.webp`;
        return CDN ? `${CDN}/brands/${file}` : `/images/brands/${file}`;
    }

    // дефолт: будуємо по назві бренду
    const file = `${nameKey}.webp`;
    return CDN ? `${CDN}/brands/${file}` : `/images/brands/${file}`;
};
