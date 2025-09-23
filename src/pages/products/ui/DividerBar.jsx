import React from 'react';
import s from '../Products.module.scss';

export default function DividerBar({ label, children }) {
    return (
        <div className={s.divider} role="separator" aria-label={label}>
            <span className={s.dividerText}>{label}</span>
            {children}
        </div>
    );
}
