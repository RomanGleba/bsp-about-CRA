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

    const hasExt = /\.[a-z0-9]+$/i.test(imageKey);
    const isAbs = imageKey.startsWith('/') || imageKey.startsWith('http');

    // Якщо передали повний URL — використовуємо його.
    // Якщо передали key — будуємо URL з CDN_BASE (якщо заданий) або з basePath.
    let src = '';
    if (isAbs) {
        src = imageKey;
    } else if (CDN_BASE && /^(products|brands)\//i.test(imageKey)) {
        src = `${CDN_BASE}/${imageKey}`;
    } else {
        src = `${basePath}/${imageKey}${hasExt ? '' : '.webp'}`;
    }

    const fallback = placeholder || `${basePath}/placeholder.webp`;
    const normalizedFetchPriority =
        fetchPriority === 'high' || fetchPriority === 'low' ? fetchPriority : 'auto';

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
            fetchPriority={normalizedFetchPriority}
            referrerPolicy="no-referrer"
            draggable={false}
            style={{ display: 'block', maxWidth: '100%', ...style }}
            onError={(e) => {
                if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
            }}
        />
    );
}
