import { useState } from "react";

export const useChainNetwork = () => {
    const [currentChain, setCurrentChain] = useState("");

    return {
        currentChain,
        setCurrentChain,
    };
};
