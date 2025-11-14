import React, { memo } from 'react';
import ProductImage from '../../../ui/background/media/productImage/ProductImage';
import s from './ProductCard.module.scss';

const DEFAULT_SIZES =
    '(min-width: 1200px) 25vw, (min-width: 768px) 33vw, 50vw';

function splitTitleAndWeight(name = '') {
    const sName = String(name).trim();

    const packRe =
        /^(.*\S)\s+(\d+)\s*[x×]\s*(\d+(?:[.,]\d+)?)\s?(кг|г|kg|g|мл|ml)\.?$/i;
    const singleRe =
        /^(.*\S)\s+(\d+(?:[.,]\d+)?)\s?(кг|г|kg|g|мл|ml)\.?$/i;

    const normUnit = (u) => {
        const unit = u.toLowerCase();
        if (unit === 'kg') return 'кг';
        if (unit === 'g') return 'г';
        if (unit === 'ml') return 'мл';
        return unit;
    };

    let m = sName.match(packRe);
    if (m) {
        const [, before, count, valRaw, unitRaw] = m;
        const unit = normUnit(unitRaw);
        const val = String(valRaw).replace(',', '.');
        const displayVal = val.includes('.') ? val.replace('.', ',') : val;
        return { title: before.trim(), weight: `${count}×${displayVal} ${unit}` };
    }

    m = sName.match(singleRe);
    if (m) {
        const [, before, valRaw, unitRaw] = m;
        const unit = normUnit(unitRaw);
        const val = String(valRaw).replace(',', '.');
        const displayVal = val.includes('.') ? val.replace('.', ',') : val;
        return { title: before.trim(), weight: `${displayVal} ${unit}` };
    }

    return { title: sName, weight: '' };
}

const FLAVOR_COLOR = [
    { key: /(ялович|говядин|beef|marha)/i, label: 'Яловичина', color: '#e11d48' },
    { key: /(курк|куриц|chicken|csirke)/i, label: 'Курка',      color: '#f59e0b' },
    { key: /(індич|индик|turkey|pulyka)/i, label: 'Індичка',    color: '#22c55e' },
    { key: /(качк|утк|duck|kacsa)/i,       label: 'Качка',      color: '#16a34a' },
    { key: /(лосос|риба|fish|salmon|tuna)/i, label: 'Риба',     color: '#3b82f6' },
    { key: /(крол|rabbit|ny[uú]l)/i,       label: 'Кролик',     color: '#a855f7' },
    { key: /(дичин|game|vad)/i,            label: 'Дичина',     color: '#a3e635' },
    { key: /(теля|veal)/i,                 label: 'Телятина',   color: '#ef4444' },
    { key: /(печін|печен|liver)/i,         label: 'Печінка',    color: '#8b5e34' },
    { key: /(шинк|ham)/i,                  label: 'Шинка',      color: '#ff6b9a' },
    { key: /(ягнят|ягня|lamb)/i,           label: 'Ягня',       color: '#10b981' },
    { key: /(м[’']?ясн.*м[іi]кс|асорті|mix)/i, label: 'М’ясний мікс', color: '#d260ee' },
];

function extractFlavor(name = '', imageKey = '') {
    const fields = [String(name), String(imageKey)];
    for (const text of fields) {
        for (const def of FLAVOR_COLOR) {
            if (def.key.test(text)) return { flavor: def.label, color: def.color };
        }
    }
    return { flavor: '', color: '' };
}

function ProductCardBase({
                             p,
                             priority = false,
                             onClick,
                             focused = false,
                             sizes = DEFAULT_SIZES,
                             imgProps = {},
                             titleTag: TitleTag = 'h5',
                         }) {
    const interactive = typeof onClick === 'function';
    const Tag = interactive ? 'button' : 'div';

    const { title, weight } = splitTitleAndWeight(p?.name);
    const { flavor, color } = extractFlavor(p?.name, p?.image);

    return (
        <Tag
            type={interactive ? 'button' : undefined}
            className={[
                s.productCard,
                interactive ? s.clickable : '',
                focused ? s.focused : '',
            ]
                .filter(Boolean)
                .join(' ')}
            role={interactive ? 'button' : 'group'}
            aria-label={p?.name || 'Картка товару'}
            onClick={interactive ? onClick : undefined}
            title={p?.name}
            data-interactive={interactive || undefined}
        >
            <div className={s.body}>
                <div className={s.media} aria-hidden="true">
                    {flavor && (
                        <span
                            className={s.flavorBadge}
                            style={{ backgroundColor: color }}
                            aria-hidden="true"
                        >
                            {flavor}
                        </span>
                    )}

                    <div className={s.mediaInner} style={{ '--img-scale': p?.imgScale ?? 1 }}>
                        <ProductImage
                            imageKey={p.image}
                            alt={p?.name || 'Фото товару'}
                            basePath="/images/products"
                            fetchPriority={priority ? 'high' : 'auto'}
                            loading={priority ? 'eager' : 'lazy'}
                            decoding="async"
                            sizes={sizes}
                            {...imgProps}
                        />
                    </div>

                    {weight && (
                        <span className={s.weightBadge} aria-hidden="true">
                            {weight}
                        </span>
                    )}
                </div>

                <TitleTag className={s.title}>{title}</TitleTag>
            </div>
        </Tag>
    );
}

export default memo(ProductCardBase);
