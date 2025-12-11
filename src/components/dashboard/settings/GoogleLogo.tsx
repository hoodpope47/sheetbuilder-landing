"use client";

import Image from "next/image";

export function GoogleLogo() {
    return (
        <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm">
            <Image
                src="/logos/google.png"
                alt="Google logo"
                width={20}
                height={20}
                className="h-5 w-5"
            />
        </span>
    );
}
