import React from "react";
import s from "./BackgroundImage.module.scss";

export default function BackgroundImageOne({ webp, jpg, alt }) {
    const fallback = jpg || webp;

    return (
        <picture className={s.bgWrap}>
            {webp && <source srcSet={webp} type="image/webp" />}
            <img className={s.bg} src={fallback} alt={alt} loading="eager" />
        </picture>
    );
}
