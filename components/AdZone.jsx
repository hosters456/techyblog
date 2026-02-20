'use client';

export default function AdZone({ id, className = "" }) {
    return (
        <div
            id={id}
            className={`ad-zone flex justify-center items-center overflow-hidden my-6 ${className}`}
            style={{ minHeight: '100px' }}
        >
            <a
                href="https://hilltopads.com/?ref=364851"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-transform hover:scale-[1.02]"
            >
                <img
                    src="//static.hilltopads.com/other/banners/pub/huge_income/728x90.gif?v=1771508868"
                    alt="Advertisement"
                    className="max-w-full h-auto rounded-lg shadow-sm"
                />
            </a>
        </div>
    );
}
