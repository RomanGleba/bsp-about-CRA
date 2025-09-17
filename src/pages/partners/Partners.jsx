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
                    <img src={Epicentrk} alt="Епіцентр" className={`${s.logo} ${s.epicentr}`} />
                    <img src={Rozetka}   alt="Rozetka"  className={`${s.logo} ${s.rozetka}`} />
                    <img src={Spar}      alt="SPAR"     className={`${s.logo} ${s.spar}`} />
                    <img src={Ambar}     alt="Амбар"    className={`${s.logo} ${s.ambar}`} />

                    {/* прямокутні лого з округленням */}
                    <div className={`${s.rounded} ${s.velmartBox}`}>
                        <img src={Velmart}  alt="Velmart"  className={s.roundedImg} />
                    </div>
                    <div className={s.rounded}>
                        <img src={Divochin} alt="Дивоцін"  className={s.roundedImg} />
                    </div>
                    <div className={s.rounded}>
                        <img src={Kasta}    alt="Kasta"    className={s.roundedImg} />
                    </div>
                    <div className={s.rounded}>
                        <img src={Maudau}   alt="Maudau"   className={`${s.roundedImg} ${s.maudau}`} />
                    </div>
                </div>
            </div>
        </section>
    );
}
