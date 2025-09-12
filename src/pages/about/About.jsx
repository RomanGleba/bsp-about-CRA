import React from 'react';
import { Typography } from 'antd';
import {
    HistoryOutlined, TagsOutlined, RocketOutlined,
    CarOutlined, SafetyOutlined, HeartOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import BackgroundImage from '../../ui/background/BackgroundImage';
import { backgrounds } from '../../data/backgrounds';

import aboutUA from '../../data/json/AboutUs.json';
import aboutEN from '../../data/json/AboutUs.en.json';

import s from './About.module.scss';

const { Title, Paragraph, Text } = Typography;

/* ========== helpers for brand logos ========== */
const normBrandKey = (v = '') =>
    v.toString().trim().toLowerCase().replace(/\s+/g, '-');

/* ===== Підтягуємо всі лого з src/assets/brands/* (працює і у Vite, і у Webpack) ===== */
const brandAssetsMap = (() => {
    const map = {};

    // Vite / modern bundlers
    try {
        // eslint-disable-next-line no-undef
        if (typeof import.meta !== 'undefined' && import.meta.glob) {
            // @ts-ignore
            const mods = import.meta.glob('../../assets/brands/*.{png,jpg,jpeg,webp,svg}', {
                eager: true,
                as: 'url'
            });
            for (const p in mods) {
                const file = p.split('/').pop() || '';
                const base = file.replace(/\.(png|jpe?g|webp|svg)$/i, '');
                const dash = normBrandKey(base);
                const tight = dash.replace(/-/g, '');
                // @ts-ignore
                const url = mods[p];
                map[dash] = url;
                map[tight] = url;
            }
            return map;
        }
    } catch { /* noop */ }

    // Webpack (CRA)
    try {
        // eslint-disable-next-line global-require
        const ctx = require.context('../../assets/brands', false, /\.(png|jpe?g|webp|svg)$/);
        ctx.keys().forEach((k) => {
            const file = k.replace('./', '');
            const base = file.replace(/\.(png|jpe?g|webp|svg)$/i, '');
            const dash = normBrandKey(base);
            const tight = dash.replace(/-/g, '');
            const url = ctx(k);
            map[dash] = url;
            map[tight] = url;
        });
    } catch { /* папки може не бути — ок */ }

    return map;
})();

/** src для логотипа за назвою бренду */
const resolveBrandLogo = (name = '') => {
    const dash = normBrandKey(name);
    const tight = dash.replace(/-/g, '');
    return (
        brandAssetsMap[dash] ||
        brandAssetsMap[tight] ||
        `${process.env.PUBLIC_URL}/images/brands/${dash}.webp` // fallback у public
    );
};

const Para = React.memo(({ children, className }) =>
    children ? <Paragraph className={className || s.text}>{children}</Paragraph> : null
);

const StatStrip = React.memo(({ stats = [] }) => {
    if (!stats?.length) return null;
    return (
        <div className={s.stats} role="list" aria-label="Ключові показники компанії">
            {stats.map((it, i) => (
                <div key={`${it.label}-${i}`} className={s.statItem} role="listitem">
                    <div className={s.statValue}>{it.value}</div>
                    <div className={s.statLabel}>{it.label}</div>
                </div>
            ))}
        </div>
    );
});

/* ====== БРЕНДИ: чиста сітка логотипів ====== */
const BrandGrid = React.memo(({ title, names = [] }) => {
    if (!names?.length) return null;
    return (
        <div className={s.brandBlock}>
            <Title level={4} className={s.h4}>{title}</Title>

            <ul className={s.brandGrid}>
                {names.map((name) => (
                    <li
                        className={`${s.brandLogo} ${s[normBrandKey(name)] || ''}`}
                        key={name}
                        aria-label={name}
                    >
                        <img
                            className={s.brandImg}
                            src={resolveBrandLogo(name)}
                            alt={name}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                                const img = e.currentTarget; img.onerror = null;
                                if (/\.webp($|\?)/i.test(img.src)) { img.src = img.src.replace(/\.webp/i, '.png'); return; }
                                if (/\.png($|\?)/i.test(img.src))  { img.src = img.src.replace(/\.png/i,  '.jpg'); return; }
                                img.src = `${process.env.PUBLIC_URL}/images/brands/placeholder.webp`;
                            }}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
});

export default function About() {
    const { i18n } = useTranslation();

    const about = React.useMemo(() => {
        const lang = (i18n.language || '').toLowerCase();
        return lang.startsWith('en') ? (aboutEN || {}) : (aboutUA || {});
    }, [i18n.language]);

    const title = about?.title || '';
    const lead = about?.lead || '';
    const slogan = about?.slogan || '';
    const position = about?.position || '';

    const stats = about?.stats || [];
    const sec = about?.sections || {};
    const labels = sec?.labels || {};
    const tt = sec?.titles || {};

    const brands = about?.brands || {};
    const own = brands?.own || [];
    const ua = brands?.exclusive_ukraine || [];
    const regions = brands?.exclusive_region || [];
    const note = brands?.distributed_note;

    const growthText =
        sec?.brands_intro ||
        ((own.length || ua.length)
            ? `Маємо ${own.length} власні ТМ та ${ua.length} ексклюзивні ТМ в Україні.`
            : '');

    const blocks = [
        sec?.history && { key: 'history', title: tt?.history, icon: <HistoryOutlined />, text: sec.history },
        growthText && { key: 'growth', title: tt?.growth, icon: <RocketOutlined />, text: growthText },
        regions.length > 0 && { key: 'brands', title: tt?.brands, icon: <TagsOutlined />, text: sec.exclusive_region },
        sec?.distribution && { key: 'distribution', title: tt?.distribution, icon: <TagsOutlined />, text: sec.distribution },
        sec?.logistics && { key: 'logistics', title: tt?.logistics, icon: <CarOutlined />, text: sec.logistics },
        sec?.quality && { key: 'quality', title: tt?.quality, icon: <SafetyOutlined />, text: sec.quality },
        (sec?.gratitude_partners || sec?.gratitude_army || sec?.patriotism || sec?.promise || sec?.position) && {
            key: 'gratitude',
            title: tt?.gratitude,
            icon: <HeartOutlined />,
            text: [sec.position, sec.promise, sec.gratitude_partners, sec.gratitude_army, sec.patriotism]
                .filter(Boolean).join(' ')
        }
    ].filter(Boolean);

    return (
        <main
            className={s.page}
            style={{ '--hero-shift': '200px', '--content-shift': '200px' }}
        >
            {/* HERO з фоном */}
            <section className={s.hero} aria-labelledby="about-title">
                <BackgroundImage {...backgrounds.about} />
                <div className={s.heroBg} aria-hidden />
                <div className={s.heroGlass}>
                    <div className={s.heroInner}>
                        {slogan && <Text className={s.kicker}>{slogan}</Text>}
                        <span className={s.kickerLine} aria-hidden />
                        <Title id="about-title" level={1} className={s.title}>{title}</Title>
                        {lead && <Paragraph className={s.lead}>{lead}</Paragraph>}
                        {position && <Paragraph className={s.position}>{position}</Paragraph>}
                        <StatStrip stats={stats} />
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <section className={s.section}>
                <div className={s.container}>
                    {/* ВЕЛИКИЙ CARD-БЛОК ІЗ УСІМА БРЕНДАМИ */}
                    <section className={`${s.brandsSummary} ${s.brandsSummaryCard}`} aria-labelledby="brands-summary-title">
                        <Title level={2} id="brands-summary-title" className={s.h2}>
                            {labels?.brands_summary_title || 'Бренди та партнерства'}
                        </Title>

                        <BrandGrid title={labels?.own || 'Власні ТМ'} names={own} />
                        <BrandGrid title={labels?.ua || 'Ексклюзивні ТМ в Україні'} names={ua} />
                        <BrandGrid title={labels?.regions || 'Ексклюзивні ТМ у регіонах'} names={regions} />
                        {note && <Para className={s.note}>{note}</Para>}
                    </section>

                    <div className={s.timeline}>
                        <div className={s.rail} aria-hidden />
                        {blocks.map((b) => (
                            <article key={b.key} className={s.card}>
                                <span className={s.pin} aria-hidden />
                                <div className={s.body}>
                                    <div className={s.head}>
                                        <span className={s.icon}>{b.icon}</span>
                                        <Title level={3} className={s.h3}>{b.title}</Title>
                                    </div>
                                    <Para>{b.text}</Para>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
