import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { PhoneOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import LangSwitcher from '../lang/LangSwitcher';
import Logo from '../../ui/logo/Logo.jsx';
import s from './Navbar.module.scss';

function IconBurger({ size = 22, className = '' }) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7.5h16M4 12h16M4 16.5h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
    );
}

export default function Navbar() {
    const { pathname } = useLocation();
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const triggerRef = useRef(null);

    const navItems = useMemo(
        () => [
            { key: '/', label: t('header.home'), to: '/' },
            { key: '/products', label: t('header.products'), to: '/products' },
            { key: '/partners', label: t('header.partners'), to: '/partners' },
            { key: '/contacts', label: t('header.contacts'), to: '/contacts' },
            { key: 'marketplace', label: t('header.marketplace'), external: 'https://your-marketplace-link.com' },
        ],
        [t]
    );

    const activeKey = useMemo(() => {
        const match = navItems
            .filter((i) => i.to)
            .map((i) => i.key)
            .filter((k) => pathname === k || pathname.startsWith(k + '/'))
            .sort((a, b) => b.length - a.length)[0];
        return match || '/';
    }, [pathname, navItems]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 2);
        const onResize = () => setIsMobile(window.innerWidth < 992);
        onScroll(); onResize();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);
        return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); };
    }, []);

    // блокувати скрол сторінки, коли відкрите меню
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = open ? 'hidden' : prev || '';
        return () => { document.body.style.overflow = prev; };
    }, [open]);

    // закривати по Escape
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && setOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    // закриваємо меню при зміні маршруту
    useEffect(() => { setOpen(false); }, [pathname]);

    return (
        <header className={`${s.header} ${scrolled ? s.scrolled : ''}`} role="banner">
            <div className={s.inner}>
                <Link to="/" className={s.logo} aria-label="BSP Group — на головну">
                    <Logo width={150} height={30} className={s.logoShift} />
                </Link>

                {/* Desktop navigation */}
                <nav className={s.navDesktop} aria-label="Головна навігація">
                    <ul className={s.menu}>
                        {navItems.map((i) => (
                            <li key={i.key}>
                                {i.external ? (
                                    <a href={i.external} target="_blank" rel="noopener noreferrer" className={s.navLink}>
                                        {i.label}
                                    </a>
                                ) : (
                                    <NavLink
                                        to={i.to}
                                        className={({ isActive }) =>
                                            isActive || activeKey === i.key ? `${s.navLink} ${s.navLinkActive}` : s.navLink
                                        }
                                    >
                                        {i.label}
                                    </NavLink>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Actions */}
                <div className={s.actions}>
                    <div className={s.onlyDesktop}><LangSwitcher /></div>

                    {isMobile && <div className={s.onlyMobile}><LangSwitcher mobileMode /></div>}

                    <a href="tel:+380979445353" className={s.cta} aria-label={t('header.contact')}>
                        <PhoneOutlined className={s.icon} /><span>{t('header.contact')}</span>
                    </a>

                    <button
                        ref={triggerRef}
                        className={s.burger}
                        aria-label={t('header.menu') || 'Меню'}
                        aria-controls="mobile-menu"
                        aria-expanded={open ? 'true' : 'false'}
                        onClick={() => setOpen(true)}
                    >
                        <IconBurger size={22} />
                    </button>
                </div>
            </div>

            {/* MOBILE FULLSCREEN MENU */}
            <aside
                id="mobile-menu"
                className={`${s.sidebar} ${open ? s.open : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label={t('header.menu') || 'Меню'}
                onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
            >
                <div className={s.sidebarHeader}>
                    <Link to="/" className={s.logo} onClick={() => setOpen(false)} aria-label="На головну">
                        <Logo width={150} height={56} compact />
                    </Link>
                    <button className={s.closeBtn} aria-label="Закрити меню" onClick={() => { setOpen(false); triggerRef.current?.focus(); }}>
                        <CloseOutlined />
                    </button>
                </div>

                <div className={s.sidebarTop}>
                    <LangSwitcher mobileMode />
                    <a
                        href="tel:+380979445353"
                        className={`${s.cta} ${s.ctaMobile}`}
                        aria-label={t('header.contact')}
                        onClick={() => setOpen(false)}
                    >
                        <PhoneOutlined className={s.icon} />
                        <span>{t('header.contact')}</span>
                    </a>
                </div>

                <nav className={s.sidebarNav} aria-label="Мобільна навігація">
                    <ul>
                        {navItems.map((i) => (
                            <li key={i.key}>
                                {i.external ? (
                                    <a
                                        href={i.external}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={s.navLink}
                                        onClick={() => setOpen(false)}
                                    >
                                        {i.label}
                                    </a>
                                ) : (
                                    <NavLink
                                        to={i.to}
                                        onClick={() => setOpen(false)}
                                        className={({ isActive }) =>
                                            isActive || activeKey === i.key ? `${s.navLink} ${s.navLinkActive}` : s.navLink
                                        }
                                    >
                                        {i.label}
                                    </NavLink>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </header>
    );
}
