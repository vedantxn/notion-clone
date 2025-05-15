import Image from "next/image";

export const Heroes = () => {
    return (
        <div className="flex flex-col items-center justify-center max-w-5xl">
            <div className="flex items-center">
                <div className="relative w-[300px] h-[300px] sm:w-[3500px] sm:h-[350px] md:w-[400px] md:h-[400px]">
                    <Image
                        src="/Chill-Time.png"
                        fill
                        className="object-contain"
                        alt="Document"
                    />
                </div>
                <div className="relative w-[300px] h-[300px] sm:w-[3500px] sm:h-[350px] md:w-[400px] md:h-[400px] hidden md:block">
                    <Image
                        src="/Fast-Internet.png"
                        fill
                        className="object-contain"
                        alt="Document"
                    />
                </div>

            </div>
            
        </div>
    )
}

