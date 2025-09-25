import React from "react";
import s from "./BackgroundImage.module.scss";

export default function BackgroundImage({
                                               webp, jpg, alt, loading = "eager", className, style
                                           }) {
    const fallback = jpg || webp;

    return (
        <picture className={`${s.bgWrap} ${className || ""}`} style={style}>
            {webp && <source srcSet={webp} type="image/webp" />}
            <img className={s.bg} src={fallback} alt={alt} loading={loading} />
        </picture>
    );
}
