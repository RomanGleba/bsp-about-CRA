import { useMemo } from 'react';
import brandsData from '../../../data/json/Brends.json';
import { toKebabKey } from '../utils/brandUtils';

export function useBrands() {
    return useMemo(() => {
        const raw = (brandsData?.brends || []).map((b) => ({
            key: toKebabKey(b.name),
            name: (b.name ?? '').trim(),
            image: b.image || null,
            id: b.id || null,
        }));
        const unique = new Map();
        raw.forEach((b) => { if (!unique.has(b.key)) unique.set(b.key, b); });
        return Array.from(unique.values()).sort((a, b) =>
            a.name.localeCompare(b.name, 'uk')
        );
    }, []);
}
