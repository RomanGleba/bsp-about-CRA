import React, {
    useEffect,
    useMemo,
    useState,
    useId,
    useCallback,
    useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import s from './LangSwitcher.module.scss';

const normalize = (code = '') =>
    String(code).toLowerCase().startsWith('en') ? 'en' : 'uk';

export default function LangSwitcher({
                                         className = '',
                                         size = 'md',          // 'sm' | 'md'
                                         value: valueProp,     // контрольований режим (опційно)
                                         defaultValue,         // дефолт (опційно)
                                         onChange,             // колбек (опційно)
                                         mobileMode = false,   // мобільний режим: кнопка + dropdown
                                     }) {
    const { i18n } = useTranslation();
    const groupId = useId();

    // ініціалізація (без авто-визначення мови браузера — як просили)
    const [value, setValue] = useState(() => {
        if (valueProp) return normalize(valueProp);
        if (defaultValue) return normalize(defaultValue);
        try {
            const saved = typeof window !== 'undefined'
                ? window.localStorage.getItem('lang')
                : null;
            const lang = saved || i18n.resolvedLanguage || 'uk';
            return normalize(lang);
        } catch {
            return 'uk';
        }
    });

    // контрольований режим
    useEffect(() => {
        if (valueProp !== undefined) setValue(normalize(valueProp));
    }, [valueProp]);

    const normalized = normalize(value);

    // sync i18n, <html lang>, localStorage
    useEffect(() => {
        if (normalize(i18n.resolvedLanguage) !== normalized) {
            i18n.changeLanguage(normalized);
        }
        if (typeof document !== 'undefined') {
            document.documentElement.lang = normalized;
        }
        try {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('lang', normalized);
            }
        } catch {}
    }, [normalized, i18n]);

    // реагувати на зовнішні зміни i18n
    useEffect(() => {
        const handler = (lng) => setValue(normalize(lng));
        i18n.on('languageChanged', handler);
        return () => i18n.off('languageChanged', handler);
    }, [i18n]);

    const options = useMemo(
        () => [
            { value: 'uk', label: 'Укр', name: 'Українська',  },
            { value: 'en', label: 'EN', name: 'English',      },
        ],
        []
    );

    const commit = useCallback(
        (next) => {
            const n = normalize(next);
            setValue(n);
            onChange?.(n);
        },
        [onChange]
    );

    /* ============================
       MOBILE: button + dropdown
    ============================ */
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);
    const btnRef = useRef(null);
    const listRef = useRef(null);

    // закриття по кліку поза/по Escape
    useEffect(() => {
        if (!open) return;
        const onDocClick = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        const onKey = (e) => {
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('mousedown', onDocClick);
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('mousedown', onDocClick);
            window.removeEventListener('keydown', onKey);
        };
    }, [open]);

    // keyboard navigation усередині меню
    const onKeyDownMenu = (e) => {
        if (!open) return;
        const items = listRef.current?.querySelectorAll('button[role="menuitem"]');
        if (!items || !items.length) return;

        const current = document.activeElement;
        const idx = Array.from(items).findIndex((el) => el === current);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = items[(idx + 1 + items.length) % items.length];
            next?.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = items[(idx - 1 + items.length) % items.length];
            prev?.focus();
        } else if (e.key === 'Home') {
            e.preventDefault();
            items[0]?.focus();
        } else if (e.key === 'End') {
            e.preventDefault();
            items[items.length - 1]?.focus();
        }
    };

    if (mobileMode) {
        const active = options.find((o) => o.value === normalized) || options[0];
        return (
            <div className={`${s.langMobile} ${className}`} ref={wrapRef}>
                <button
                    ref={btnRef}
                    type="button"
                    className={`${s.mobileToggle} ${s[size]}`}
                    aria-haspopup="menu"
                    aria-expanded={open}
                    aria-label="Змінити мову"
                    onClick={() => setOpen((v) => !v)}
                >
                    <span className={s.globe} aria-hidden="true">🌐</span>
                    <span className={s.flag} aria-hidden="true">{active.flag}</span>
                    <span className={s.code}>{active.label}</span>
                </button>

                {open && (
                    <ul
                        ref={listRef}
                        className={s.menu}
                        role="menu"
                        aria-label="Список мов"
                        onKeyDown={onKeyDownMenu}
                    >
                        {options.map((opt) => {
                            const selected = normalized === opt.value;
                            return (
                                <li key={opt.value} role="none">
                                    <button
                                        role="menuitem"
                                        type="button"
                                        className={`${s.menuItem} ${selected ? s.isSelected : ''}`}
                                        aria-current={selected ? 'true' : 'false'}
                                        onClick={() => {
                                            commit(opt.value);
                                            setOpen(false);
                                            // повернути фокус на кнопку після вибору
                                            requestAnimationFrame(() => btnRef.current?.focus());
                                        }}
                                    >
                                        <span className={s.flag} aria-hidden="true">{opt.flag}</span>
                                        <span className={s.name}>{opt.name}</span>
                                        <span className={s.codeSmall}>{opt.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        );
    }

    /* ============================
       DESKTOP: таби (radio group)
    ============================ */
    const idx = options.findIndex((o) => o.value === normalized);
    const title = normalized === 'uk' ? 'Мова: Українська' : 'Language: English';

    return (
        <div
            className={`${s.switcher} ${s[size]} ${className}`}
            role="radiogroup"
            aria-label={title}
            title={title}
            data-idx={idx}
            id={groupId}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
                e.preventDefault();
                const dir = e.key === 'ArrowRight' ? 1 : -1;
                const nextIdx = (idx + dir + options.length) % options.length;
                commit(options[nextIdx].value);
            }}
        >
            <span className={s.thumb} aria-hidden="true" />
            {options.map((opt) => {
                const checked = normalized === opt.value;
                const id = `${groupId}-${opt.value}`;
                return (
                    <label
                        key={opt.value}
                        className={`${s.item} ${checked ? s.selected : ''}`}
                        htmlFor={id}
                    >
                        <input
                            id={id}
                            type="radio"
                            name={`lang-${groupId}`}
                            value={opt.value}
                            checked={checked}
                            onChange={() => commit(opt.value)}
                            className={s.input}
                            aria-checked={checked}
                            role="radio"
                        />
                        <span className={s.opt}>
              {/* на десктопі показуємо код без прапора — чисті таби */}
                            {opt.label}
            </span>
                    </label>
                );
            })}
        </div>
    );
}
