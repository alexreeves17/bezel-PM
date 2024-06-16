import Image from "next/image";
import { Nunito } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Nunito({
    subsets: ["latin"],
    weight: ["400","600"]
});

export const Logo = () => {
    return (
        <div className="hidden md:flex items-center gap-x-2"> 
        <Image 
            src="/logo-black.png"
            height="40"
            width="40"
            alt="Logo"
            className="dark:hidden"
            />
        <Image 
            src="/logo-white.png"
            height="40"
            width="40"
            alt="Logo"
            className="hidden dark:block"
            />

            <p className={cn("font-semibold",font.className)}> 
                bezel PM
            </p>
        </div>
    )
}
