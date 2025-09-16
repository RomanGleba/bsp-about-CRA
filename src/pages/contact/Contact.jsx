import React from 'react';
import {
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import InstagramLink from '../../ui/logo/socialNetwork/InstagramLink';
import s from './Contact.module.scss';

const CONTACTS = {
    phone: '+380979445353',
    email: 'info@bsp-group.ua',
    address: 'Україна, Закарпатська обл., м. Ужгород, вул. Трудова, 2',
    instagramLabel: 'Instagram',
};

const telHref = (p) => `tel:${String(p).replace(/[^\d+]/g, '')}`;
const mailHref = (e) => `mailto:${String(e).trim()}`;
const mapsHref = (addr) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        String(addr).trim()
    )}`;

export default function Contacts() {
    const { t } = useTranslation();

    return (
        <section className={s.section} aria-labelledby="contacts-title">
            <div className={s.container}>
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
            <span className={s.icon}>
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
            <span className={s.icon}>
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
            <span className={s.icon}>
              <EnvironmentOutlined />
            </span>
                        <div className={s.body}>
                            <span className={s.label}>{t('contacts.address', 'Адреса')}</span>
                            <a
                                href={mapsHref(CONTACTS.address)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={s.link}
                            >
                                {CONTACTS.address}
                            </a>
                        </div>
                    </li>

                    <li className={`${s.item} ${s.itemInline}`}>
            <span className={s.iconGhost}>
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
        </section>
    );
}
