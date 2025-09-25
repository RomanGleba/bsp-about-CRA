import React from 'react';
import {
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import InstagramLink from '../../ui/logo/socialNetwork/InstagramLink';
import s from './Contact.module.scss';

import BackgroundImage from '../../ui/background/BackgroundImage';
import { backgrounds } from '../../data/backgrounds';

const CONTACTS = {
    phone: '+380979445353',
    email: 'info@bsp-group.ua',
    address: 'Україна, Закарпатська обл., м. Ужгород, вул. Проектна, 1',
    instagramLabel: 'Instagram',
};

const telHref = (p) => `tel:${String(p).replace(/[^\d+]/g, '')}`;
const mailHref = (e) => `mailto:${String(e).trim()}`;
const mapsHref = (addr) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(String(addr).trim())}`;

export default function Contacts() {
    const { t } = useTranslation();

    return (
        <section className={s.section} aria-labelledby="contacts-title">
            {/* фонове зображення на ВЕСЬ екран, приглушене для читабельності */}
            <BackgroundImage
                {...(backgrounds.partners)}
                className={s.bg}
                overlay="linear-gradient(180deg, rgba(255,255,255,.88), rgba(255,255,255,.96))"
                loading="lazy"
                fetchPriority="low"
            />

            <div className={s.container}>
                <div className={s.card}>
                    <header className={s.header}>
                        <h1 id="contacts-title" className={s.h1}>
                            {t('contacts.title', 'Контакти')}
                        </h1>
                        <p className={s.lead}>
                            {t(
                                'contacts.lead',
                                'Ми завжди на звʼязку. Оберіть зручний спосіб — і напишіть або подзвоніть.'
                            )}
                        </p>
                    </header>

                    <ul className={s.list} aria-label={t('contacts.title', 'Контакти')}>
                        <li className={s.item}>
              <span className={s.icon} aria-hidden="true">
                <PhoneOutlined />
              </span>
                            <div className={s.body}>
                                <span className={s.label}>{t('contacts.phone', 'Телефон')}</span>
                                <a href={telHref(CONTACTS.phone)} className={s.link}>
                                    {CONTACTS.phone}
                                </a>
                            </div>
                        </li>

                        <li className={s.item}>
              <span className={s.icon} aria-hidden="true">
                <MailOutlined />
              </span>
                            <div className={s.body}>
                                <span className={s.label}>Email</span>
                                <a href={mailHref(CONTACTS.email)} className={s.link}>
                                    {CONTACTS.email}
                                </a>
                            </div>
                        </li>

                        <li className={s.item}>
              <span className={s.icon} aria-hidden="true">
                <EnvironmentOutlined />
              </span>
                            <div className={s.body}>
                                <span className={s.label}>{t('contacts.address', 'Адреса')}</span>
                                <address className={s.addr}>
                                    <a
                                        href={mapsHref(CONTACTS.address)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={s.link}
                                    >
                                        {CONTACTS.address}
                                    </a>
                                </address>
                            </div>
                        </li>

                        {/* Увесь рядок Instagram клікабельний (якщо потрібно — додамо як раніше) */}
                        <li className={`${s.item} ${s.itemInline}`}>
              <span className={s.iconGhost} aria-hidden="true">
                <InstagramLink className={s.ig} size={20} />
              </span>
                            <div className={s.body}>
                                <span className={s.label}>{t('contacts.social', 'Соцмережі')}</span>
                                <span className={s.text}>{CONTACTS.instagramLabel}</span>
                            </div>
                        </li>
                    </ul>

                    <p className={s.note}>
                        {t('contacts.note', 'Графік: Пн–Пт, 09:00–18:00')}
                    </p>
                </div>
            </div>
        </section>
    );
}
