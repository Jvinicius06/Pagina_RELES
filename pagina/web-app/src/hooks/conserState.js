import { useCallback, useEffect, useState } from "react";

const useLolcalState = (name = "", initValue = "") => {
    const [state, setState] = useState(initValue);

    useEffect(() => {
        setState(localStorage.getItem(name));
    }, [name]);
    
    const setStateCall = useCallback(
        (newValue) => {
            localStorage.setItem(name, newValue);
            setState(newValue);
        },
        [name]
    );

    return [state, setStateCall];
};

export default useLolcalState;
