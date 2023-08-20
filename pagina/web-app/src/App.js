import { useCallback, useEffect, useState } from "react";
import Toggle from "./elements/toggle/index.js";
import "./App.css";

function App() {
    const [reles, setReles] = useState(Array(8).fill(false));

    const getState = (e = null) => {
        try {
            return fetch(`http://192.168.15.5/reles${e != null ? "?" + e : ""}`)
                .then((e) => e.text())
                .then((e) => {
                    const keys = e.split("&").map((e) => /ON/.test(e));
                    setReles(keys);
                    console.log(keys);
                });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getState();
        const interval = setInterval(getState, 2000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="App">
            {reles.map((value, i) => (
                <Toggle
                    key={`toogle-reley-${i}`}
                    onChangeState={(e) => {
                        getState(`rele${i + 1}=${e === true ? "ON" : "OFF"}`);
                        // setReles((old) => {
                        //     const newArray = [...old];
                        //     newArray[i] = e;
                        //     return newArray;
                        // });
                    }}
                    value={value}
                />
            ))}
        </div>
    );
}

export default App;
