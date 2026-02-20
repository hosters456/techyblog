'use client';

import { useEffect, useRef } from 'react';

export default function AdZone({ id, className = "" }) {
    const adRef = useRef(null);

    useEffect(() => {
        if (!adRef.current) return;

        // Clear any existing scripts in this zone to prevent duplication
        adRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.innerHTML = `
      (function(ftzevfo){
      var d = document,
          s = d.createElement('script'),
          l = d.scripts[d.scripts.length - 1];
      s.settings = ftzevfo || {};
      s.src = "\\/\\/illiterate-being.com\\/bjX.Vwsld\\/GulF0kY\\/W_cE\\/aejme9EuDZZUtlUkBP\\/TPYx4JMPTIQx1\\/NGDJkUtsNMj-gdxYNgD\\/U\\/1JMWw_";
      s.async = true;
      s.referrerPolicy = 'no-referrer-when-downgrade';
      l.parentNode.insertBefore(s, l);
      })({})
    `;

        adRef.current.appendChild(script);
    }, [id]);

    return (
        <div
            id={id}
            ref={adRef}
            className={`ad-zone flex justify-center items-center overflow-hidden my-6 ${className}`}
            style={{ minHeight: '100px' }}
        >
            {/* Ad will be injected here */}
        </div>
    );
}
