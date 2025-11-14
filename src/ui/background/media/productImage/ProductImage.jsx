import React from 'react';

const CDN_BASE = (process.env.REACT_APP_CDN_BASE_URL || '').replace(/\/+$/, '');

export default function ProductImage({
                                         imageKey,
                                         alt = 'Фото товару',
                                         className = '',
                                         basePath = '/images/products',
                                         width,
                                         height,
                                         sizes = '100vw',
                                         style,
                                         loading = 'lazy',
                                         decoding = 'async',
                                         fetchPriority = 'auto',
                                         placeholder,
                                     }) {
    if (!imageKey) return null;

    const hasExt = /\.[a-z0-9]+$/i.test(imageKey || '');
    const isUrl  = /^https?:\/\//i.test(imageKey || '');
    const isRoot = typeof imageKey === 'string' && imageKey.startsWith('/');
    const keyNoSlash = typeof imageKey === 'string' ? imageKey.replace(/^\/+/, '') : '';

    let src = '';

    if (isUrl || isRoot) {
        src = imageKey;
    } else if (CDN_BASE && /^(products|brands)\//i.test(keyNoSlash)) {
        src = `${CDN_BASE}/${keyNoSlash}`;
    } else {
        src = `${basePath}/${keyNoSlash}${hasExt ? '' : '.webp'}`;
    }

    const fallback =
        placeholder ||
        (basePath ? `${basePath}/placeholder.webp` : '/images/products/placeholder.webp');

    const normalizedFetchPriority =
        fetchPriority === 'high' || fetchPriority === 'low' ? fetchPriority : 'auto';

    const fetchpriorityAttr =
        normalizedFetchPriority !== 'auto'
            ? { fetchpriority: normalizedFetchPriority }
            : {};

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            width={width}
            height={height}
            sizes={sizes}
            loading={loading}
            decoding={decoding}
            {...fetchpriorityAttr}
            referrerPolicy="no-referrer"
            draggable={false}
            style={{ display: 'block', maxWidth: '100%', ...style }}
            onError={(e) => {
                if (e.currentTarget.src !== fallback) {
                    e.currentTarget.src = fallback;
                }
            }}
        />
    );
}
