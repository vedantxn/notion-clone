import { useState ,useEffect } from "react";

export const useScrollTop = () => {
    const [scrollTop, setScrollTop] = useState(false);

    const threshold = 10; // Define a threshold value (adjust as needed)

    useEffect(() => {

        const handleScroll = () => {
            if (window.scrollY > threshold) {
                setScrollTop(true);
            }
            else {
                setScrollTop(false);
            }
        }
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [threshold]); // Add dependency array for useEffect

    return scrollTop; // Return the correct state variable
};