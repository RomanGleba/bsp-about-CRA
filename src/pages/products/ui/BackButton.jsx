import React from 'react';
import s from '../Products.module.scss';

export default function BackButton({ onClick, label }) {
    return (
        <div className={s.backWrap}>
            <button type="button" className={s.backBtn} onClick={onClick}>
                {label}
            </button>
        </div>
    );
}
