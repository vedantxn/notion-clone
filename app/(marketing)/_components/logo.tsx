import Image from 'next/image';
import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';

const font = Poppins ({
    subsets: ['latin'],
    weight: ['400', '600'],
});

export const Logo = () => {
    return (
    <div className="hidden md:flex items-center gap-x-2">
        <Image
            src="logo.svg"
            alt="Paperly Logo"
            width={30}
            height={30}
        />
        <p className={cn("font-semibold", font.className)}>
        </p>
        <span className={cn("text-2xl font-bold", font.className)}>Paperly</span>
    </div>
    )
}