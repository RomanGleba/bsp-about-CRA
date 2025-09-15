import React from 'react';


export default function ProductImage({
                                         imageKey,
                                         alt = 'Фото товару',
                                         className = '',
                                         basePath = '/images/products',     // public/images/products
                                         width,
                                         height,
                                         sizes = "100vw",
                                         style,
                                         loading = 'lazy',
                                         decoding = 'async',
                                         fetchPriority = 'auto',
                                         placeholder = `${basePath}/placeholder.webp`,
                                     }) {
    if (!imageKey) return null;

    const hasExt = /\.[a-z0-9]+$/i.test(imageKey);
    const isAbs = imageKey.startsWith('/') || imageKey.startsWith('http');
    const src = isAbs
        ? imageKey
        : `${basePath}/${imageKey}${hasExt ? '' : '.webp'}`;  // завжди 1 файл: .webp

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
            fetchPriority={fetchPriority}
            referrerPolicy="no-referrer"
            draggable={false}
            style={{ maxWidth:"100%", height:"auto", objectFit:"contain", ...style }}
            onError={(e)=>{ if (e.currentTarget.src !== placeholder) e.currentTarget.src = placeholder; }}
        />

    );
}
