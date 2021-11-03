import { useState } from "react";

export const useCustomMessage = () => {
    const [customMessage, setCustomMessage] = useState({
        message: "",
        severity: "",
    });
    const [showCustomMessage, setShowCustomMessage] = useState(false);

    return {
        customMessage,
        setCustomMessage,
        showCustomMessage,
        setShowCustomMessage,
    };
};
