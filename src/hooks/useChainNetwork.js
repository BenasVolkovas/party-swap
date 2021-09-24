import { useState } from "react";

export const useChainNetwork = () => {
    const [currentChain, setCurrentChain] = useState("eth");
    const [availableChain, setAvailableChain] = useState(true);

    return {
        currentChain,
        setCurrentChain,
        availableChain,
        setAvailableChain,
    };
};
