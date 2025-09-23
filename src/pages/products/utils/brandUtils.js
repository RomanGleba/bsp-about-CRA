// utils/brandUtils.js

/** Convert string to kebab-case key */
export const toKebabKey = (v) =>
    (v ?? '').toString().trim().toLowerCase().replace(/\s+/g, '-');

/** Check if filename has extension */
export const hasExtension = (s = '') => /\.[a-z0-9]+$/i.test(s);

/** Check if path is absolute or full URL */
export const isAbsolute = (s = '') => /^\/|^https?:\/\//i.test(s);

/** Map of brand logo assets (Webpack require.context for CRA/Vite) */
export const brandLogoUrlByKey = (() => {
    const ctx = require.context('../../../assets/brands', false, /\.(png|jpe?g|webp|svg)$/);
    const map = {};
    ctx.keys().forEach((k) => {
        const file = k.replace('./', '');
        const key = toKebabKey(file.replace(/\.(png|jpe?g|webp|svg)$/i, ''));
        map[key] = ctx(k);
    });
    return map;
})();

/**
 * Resolve src for brand logo.
 * Priority:
 *  1. If brand.image is absolute or has extension → return as is
 *  2. If brand.image = "acme" (no extension) → look in logo map, else fallback to /public
 *  3. If no image → try by brand.name
 */
export const resolveBrandLogoSrc = (brand) => {
    const keyFromName = toKebabKey(brand.name);
    const image = (brand.image || '').trim();

    if (image && !isAbsolute(image) && !hasExtension(image)) {
        const k = toKebabKey(image);
        return brandLogoUrlByKey[k] || `${process.env.PUBLIC_URL}/images/brands/${k}.webp`;
    }
    if (image) return image;

    return brandLogoUrlByKey[keyFromName] || `${process.env.PUBLIC_URL}/images/brands/${keyFromName}.webp`;
};
