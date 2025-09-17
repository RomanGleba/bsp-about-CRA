// PartnersPage.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import s from './Partners.module.scss';

import Epicentrk from '../../assets/partners/Epicentrk.svg';
import Rozetka   from '../../assets/partners/logorozetka.svg';
import Spar      from '../../assets/partners/spar-1.svg';
import Ambar     from '../../assets/partners/Ambar.svg';
import Velmart   from '../../assets/partners/Velmart.svg';
import Divochin  from '../../assets/partners/divochin.svg';
import Kasta     from '../../assets/partners/kasta.svg';
import Maudau    from '../../assets/partners/Maudau.svg';

const partners = [
    { id: 1, name: 'Епіцентр', logo: Epicentrk },
    { id: 2, name: 'Rozetka',  logo: Rozetka },
    { id: 3, name: 'SPAR',     logo: Spar },
    { id: 4, name: 'Амбар',    logo: Ambar },
    { id: 5, name: 'Velmart',  logo: Velmart, rounded: true },
    { id: 6, name: 'Дивоцін',  logo: Divochin, rounded: true },
    { id: 7, name: 'Kasta',    logo: Kasta, rounded: true },
    { id: 8, name: 'Maudau',   logo: Maudau, rounded: true },
];

export default function PartnersPage() {
    const { t } = useTranslation();

    return (
        <section className={s.section}>
            <div className={s.container}>
                <header className={s.heading}>
                    <h1 className={s.title}>{t('partners.title', 'Наші партнери')}</h1>
                    <p className={s.subtitle}>
                        {t('partners.subtitle', 'Ми пишаємося співпрацею з провідними компаніями світу')}
                    </p>
                </header>

                <div className={s.grid}>
                    {partners.map((p) => (
                        <img
                            key={p.id}
                            src={p.logo}
                            alt={p.name}
                            className={`${s.logo} ${p.rounded ? s.rounded : ''}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
