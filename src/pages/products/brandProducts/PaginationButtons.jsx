import React from 'react';
import s from '../Products.module.scss';

/**
 * Shows pagination controls within an opened brand section.
 * variant="more"     -> Show more / Show all
 * variant="collapse" -> Collapse
 */
export default function PaginationButtons({ variant, onShowMore, onShowAll, onCollapse }) {
    if (variant === 'more') {
        return (
            <div className={s.loadMoreWrap}>
                <button type="button" className={s.loadMoreBtn} onClick={onShowMore}>
                    Показати ще
                </button>
                <button type="button" className={s.showAllBtn} onClick={onShowAll}>
                    Показати всі
                </button>
            </div>
        );
    }
    return (
        <div className={s.collapseWrap}>
            <button type="button" className={s.collapseBtn} onClick={onCollapse}>
                Згорнути
            </button>
        </div>
    );
}
