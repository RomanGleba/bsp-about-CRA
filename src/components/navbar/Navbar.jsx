import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { PhoneOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import LangSwitcher from '../lang/LangSwitcher';
import Logo from '../../ui/logo/Logo.jsx';
import s from './Navbar.module.scss';

export default function Navbar() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // ===== Items (internal + external) =====
    const navItems = useMemo(
        () => [
            { key: '/',          label: t('header.home'),     to: '/' },
            { key: '/products',  label: t('header.products'), to: '/products' },
            { key: '/about',     label: t('header.about'),    to: '/about' },
            { key: '/partners',  label: t('header.partners'), to: '/partners' },
            { key: '/contacts',  label: t('header.contacts'), to: '/contacts' },
            {
                key: 'external',
                label: t('header.marketplace'),
                href: 'https://prom.ua/c3378143-lapkisvit.html',
                external: true,
            },
        ],
        [t]
    );

    // ===== Active key only for internal routes =====
    const activeKey = useMemo(() => {
        const internal = navItems.filter(i => i.to).map(i => i.key);
        const match = internal
            .filter(k => pathname === k || pathname.startsWith(k + '/'))
            .sort((a, b) => b.length - a.length)[0];
        return match || '/';
    }, [pathname, navItems]);

    // ===== Effects =====
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 2);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = prev; };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && setOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    const toContacts = () => navigate('/contacts');

    // ===== Render =====
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
                                    <a
                                        href={i.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={s.navLink}
                                    >
                                        {i.label}
                                    </a>
                                ) : (
                                    <NavLink
                                        to={i.to}
                                        className={({ isActive }) =>
                                            isActive || activeKey === i.key
                                                ? `${s.navLink} ${s.navLinkActive}`
                                                : s.navLink
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
                    <LangSwitcher mobileMode />
                    <a href="tel:+380979445353" className={s.cta} aria-label={t('header.contact')}>
                        <PhoneOutlined className={s.icon} />
                        <span>{t('header.contact')}</span>
                    </a>
                    <button
                        type="button"
                        className={`${s.burger} ${s.btnIcon}`}
                        aria-label={t('header.menu') || 'Меню'}
                        aria-expanded={open ? 'true' : 'false'}
                        aria-controls="mobile-menu"
                        onClick={() => setOpen(true)}
                    >
                        <MenuOutlined />
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
                        <Logo width={130} height={36} compact />
                    </Link>
                    <button
                        type="button"
                        className={`${s.btnIcon} ${s.closeBtn}`}
                        aria-label="Закрити меню"
                        onClick={() => setOpen(false)}
                    >
                        <CloseOutlined />
                    </button>
                </div>

                <div className={s.sidebarTop}>
                    <LangSwitcher mobileMode />
                    <button
                        type="button"
                        className={`${s.cta} ${s.ctaMobile}`}
                        onClick={() => { setOpen(false); toContacts(); }}
                        aria-label={t('header.contact')}
                    >
                        <PhoneOutlined className={s.icon} />
                        <span>{t('header.contact')}</span>
                    </button>
                </div>

                <nav className={s.sidebarNav} aria-label="Мобільна навігація">
                    <ul>
                        {navItems.map((i) => (
                            <li key={i.key}>
                                {i.external ? (
                                    <a
                                        href={i.href}
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
                                            isActive || activeKey === i.key
                                                ? `${s.navLink} ${s.navLinkActive}`
                                                : s.navLink
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
