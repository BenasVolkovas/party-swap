import { useState } from "react";

export const useChainNetwork = () => {
    const [currentChain, setCurrentChain] = useState("eth");
    const [availableChain, setAvailableChain] = useState(true);
    const [showNetworkMessage, setShowNetworkMessage] = useState("");

    return {
        currentChain,
        setCurrentChain,
        availableChain,
        setAvailableChain,
        showNetworkMessage,
        setShowNetworkMessage,
    };
};
