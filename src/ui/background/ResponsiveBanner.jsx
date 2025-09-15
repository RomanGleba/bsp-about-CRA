import React, { memo } from "react";
import s from "./ResponsiveBanner.module.scss";

function ResponsiveBanner({
                                 webp,                       // "/images/backgrounds/hero.webp"
                                 jpg,                        // "/images/backgrounds/hero.jpg" (опціонально)
                                 alt = "Корм для улюбленців — BSP Group",

                                 // опції банера (необов'язково)
                                 height = "clamp(280px, 50vh, 560px)",
                                 overlay = "linear-gradient(180deg, rgba(0,0,0,.45), rgba(0,0,0,.20))",
                                 position = "50% 35%",

                                 // перфоманс
                                 loading = "eager",
                                 fetchPriority = "high",
                                 decoding = "async",
                                 sizes = "100vw",
                                 fallbackWidth = 1600,
                                 fallbackHeight = 900,

                                 className = "",
                                 children,
                             }) {
    const fallback = jpg || webp;

    const styleVars = {
        "--banner-h": height,
        "--overlay": overlay,
        "--img-pos": position,
    };

    return (
        <section className={`${s.banner} ${className}`} style={styleVars}>
            <picture className={s.picture}>
                {webp && <source srcSet={webp} type="image/webp" />}
                <img
                    className={s.img}
                    src={fallback}
                    alt={alt}
                    loading={loading}
                    decoding={decoding}
                    fetchpriority={fetchPriority}
                    sizes={sizes}
                    width={fallbackWidth}
                    height={fallbackHeight}
                />
            </picture>

            <span className={s.overlay} aria-hidden="true" />
            {children ? <div className={s.content}>{children}</div> : null}
        </section>
    );
}

export default memo(ResponsiveBanner);
