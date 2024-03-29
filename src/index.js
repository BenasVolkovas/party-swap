import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MoralisProvider } from "react-moralis";
import "./index.css";

// const appId = process.env.REACT_APP_APP_ID;
// const serverUrl = process.env.REACT_APP_SERVER_URL;

ReactDOM.render(
    <React.StrictMode>
        {/* <MoralisProvider appId={appId} serverUrl={serverUrl}> */}
        <App />
        {/* </MoralisProvider> */}
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
