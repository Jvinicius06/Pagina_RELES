import { useState, useEffect } from "react";

const useReles = () => {
    const [start, setStart] = useState(false);
    const [sucess, setSucess] = useState(false);
    const [reles, setReles] = useState(Array(8).fill(false));

    const getState = async (e = null) => {
        try {
            const response = await fetch(`/reles${e != null ? "?" + e : ""}`);
            const data = await response.text();
            const keys = data.split("&").map((e) => !!/ON/.test(e));
            setReles(keys);
            setSucess(true);
            return true;
        } catch (error) {
            return false;
        }
    };

    useEffect(() => {
        try {
            getState();
            setStart(true);
            const interval = setInterval(() => {
                getState();
            }, 2000);
            return () => {
                clearInterval(interval);
            };
        } catch (error) {
            setSucess(false);
        }
    }, []);

    return {
        start,
        sucess,
        reles,
        getState,
    };
};

export default useReles;
