import React from 'react';

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
    const src = isAbs ? imageKey : `${basePath}/${imageKey}${hasExt ? '' : '.webp'}`;
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
            {...{ fetchpriority: normalizedFetchPriority }}
            referrerPolicy="no-referrer"
            draggable={false}
            /* ВАЖЛИВО: НЕ задаємо тут height:auto/objectFit — хай керує CSS у картці */
            style={{ display: 'block', maxWidth: '100%', ...style }}
            onError={(e) => {
                if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
            }}
        />
    );
}
