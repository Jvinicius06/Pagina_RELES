import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

const BodyToggle = styled.div`
    background-color: red;
    margin: 10px;
    width: 115px;
    height: 56px;
    /* left: 0px;
    top: 0px; */
    position: relative;
    background: white;
    box-shadow: 0px 4px 4px rgba(197.62, 197.62, 197.62, 0.5) inset;
    border-radius: 28px;
    overflow: visible;
`;

const CircleToggle = styled.div`
    width: 42px;
    height: 42px;
    left: ${({ on }) => (on === true ? "65px" : "11px")};
    top: 7px;
    position: absolute;
    background: ${({ on }) => (on === true ? "#0038ff" : "#FF0000")};
    border-radius: 9999px;
    transition: background, left 100ms;
`;

const Toggle = ({ onChangeState, value }) => {
    const [on, setOn] = useState(true);

    useEffect(() => {
        setOn(value);
    }, [value]);

    const updateState = useCallback(() => {
        setOn((old) => {
            onChangeState?.(!old);
            return !old;
        });
    }, [onChangeState]);

    return (
        <BodyToggle
            onClick={(e) => {
                e.preventDefault();
                updateState();
            }}
        >
            <CircleToggle on={on} />
        </BodyToggle>
    );
};

export default Toggle;
