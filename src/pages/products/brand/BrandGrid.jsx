import React from 'react';
import { toKebabKey } from '../utils/brandUtils';

/**
 * BrandGrid — простий список брендів без стилів.
 * Відображає назву бренду, кількість продуктів і кнопку для відкриття.
 */
export default function BrandGrid({
                                      brands = [],
                                      activeBrandKey = null,
                                      onToggleBrand,
                                      productCountByBrand = new Map(),
                                      resolveLogoSrc,
                                  }) {
    return (
        <div>
            {brands.map((b) => {
                const brandName = String(b?.name || '').trim();
                const brandKey = toKebabKey(brandName);
                const isActive = activeBrandKey === brandKey;
                const count = productCountByBrand.get(brandKey) || 0;
                const logoSrc = resolveLogoSrc ? resolveLogoSrc(b) : (b?.image || '');

                return (
                    <div
                        key={brandKey || brandName}
                        style={{
                            border: isActive ? '2px solid #0B6EFB' : '1px solid #ccc',
                            padding: '10px',
                            marginBottom: '10px',
                            borderRadius: '8px',
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => onToggleBrand?.(brandKey)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                            }}
                        >
                            {logoSrc ? (
                                <img
                                    src={logoSrc}
                                    alt={brandName}
                                    style={{ width: 60, height: 60, objectFit: 'contain' }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: 60,
                                        height: 60,
                                        background: '#eee',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    —
                                </div>
                            )}

                            <div>
                                <div style={{ fontWeight: '600', fontSize: '16px' }}>{brandName}</div>
                                <div style={{ fontSize: '14px', color: '#555' }}>
                                    {isActive ? 'Згорнути' : `Дивитися (${count})`}
                                </div>
                            </div>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
