import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";

const CustomComponent = () => {
    const [dex, setDex] = useState("");
    const { user, Moralis } = useMoralis();

    useEffect(() => {
        initializePlugin();
    }, []);

    const initializePlugin = async () => {
        await Moralis.enable();
        await Moralis.initPlugins();
        setDex(Moralis.Plugins.oneInch);
    };

    const checkAllowance = async () => {
        const response = await dex.hasAllowance({
            chain: "bsc",
            fromTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            fromAddress: user.attributes.ethAddress,
            amount: 1000,
        });
        console.log("Allowance response: ", response);
    };

    return <button onClick={() => checkAllowance()}>Get allowanse</button>;
};

export default CustomComponent;
