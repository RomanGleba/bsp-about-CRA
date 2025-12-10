const BASE = (process.env.REACT_APP_CDN_BASE_URL || '').replace(/\/+$/, '');

export const cdn = (p) =>
    !p || /^https?:\/\//.test(p) || !BASE || !p.startsWith('/')
        ? p
        : `${BASE}${p}`;