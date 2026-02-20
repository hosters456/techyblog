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
      <a href="https://hilltopads.com/?ref=364851"><img src="//static.hilltopads.com/other/banners/pub/huge_income/728x90.gif?v=1771508868"></a>
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
