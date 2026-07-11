"use client"

import { useEffect, useState } from "react";

import { SettingsModal } from "../modals/settings-modal";
import { CoverImageModal } from "../modals/cover-image-modal";

export  const ModalProvider = () => {

    const [ isMounted, setIsMouted ] = useState(false);

    useEffect(() => {
        setIsMouted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <SettingsModal />
            <CoverImageModal />
        </>
    )
}



