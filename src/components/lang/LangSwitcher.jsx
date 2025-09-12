import { useEffect, useMemo, useState } from 'react';
import { Segmented, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import s from './LangSwitcher.module.scss';

const normalize = (code = '') => (String(code).startsWith('en') ? 'en' : 'uk');

export default function LangSwitcher() {
    const { i18n } = useTranslation();

    // Ініціалізація зі сховища / i18n / браузера
    const [value, setValue] = useState(() => {
        const saved =
            typeof window !== 'undefined' ? window.localStorage.getItem('lang') : null;
        const lang =
            saved ||
            i18n.resolvedLanguage ||
            (typeof navigator !== 'undefined' ? navigator.language : 'uk');
        return normalize(lang);
    });

    // Синхронізація при зміні value: i18n, <html lang>, localStorage
    useEffect(() => {
        if (i18n.resolvedLanguage && normalize(i18n.resolvedLanguage) !== value) {
            i18n.changeLanguage(value);
        }
        if (typeof document !== 'undefined') {
            document.documentElement.lang = value === 'en' ? 'en' : 'uk';
        }
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('lang', value);
        }
    }, [value, i18n]);

    // Підписка: якщо мову змінять десь ще → оновити локальний стан
    useEffect(() => {
        const handler = (lng) => setValue(normalize(lng));
        i18n.on('languageChanged', handler);
        return () => i18n.off('languageChanged', handler);
    }, [i18n]);

    const options = useMemo(
        () => [
            { value: 'uk', label: <span className={s.opt}>UA</span> },
            { value: 'en', label: <span className={s.opt}>EN</span> },
        ],
        []
    );

    const title = value === 'uk' ? 'Мова: Українська' : 'Language: English';

    const onChange = (v) => setValue(normalize(v));

    return (
        <Tooltip title={title}>
            <Segmented
                aria-label={title}
                value={value}
                onChange={onChange}
                options={options}
                size="small"
                className={s.switcher}
            />
        </Tooltip>
    );
}
