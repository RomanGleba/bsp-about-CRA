/**
 * Приводить назву бренду до безпечного key
 * "Happy Dog " → "happy-dog"
 */
export function toKebabKey(name) {
    return String(name || '')
        .trim()               // ✅ усуваємо пробіли
        .toLowerCase()
        .replace(/\s+/g, '-')  // пробіли → тире
        .replace(/[^a-z0-9-]/g, ''); // тільки латинські символи та цифри
}

/**
 * Отримати правильний src логотипу бренду
 */
export function resolveBrandLogoSrc(brand) {
    const base = (process.env.REACT_APP_CDN_BASE_URL || '').replace(/\/+$/, '');
    if (!brand) return '';
    const raw = typeof brand.image === 'string' ? brand.image : (brand.image?.key || '');
    if (!raw) return '';
    if (/^https?:\/\//i.test(raw)) return raw;
    return `${base}/${encodeURIComponent(raw.replace(/^\/+/, ''))}`;
}
