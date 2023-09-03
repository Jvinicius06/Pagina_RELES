import { createRef, useCallback, useEffect, useState } from "react";
import Toggle from "./elements/toggle/index.js";
import "./App.css";
import useReles from "./hooks/reles.js";
import Spinner from "./elements/spiner/spiner.js";
import Grid from "./elements/grid/index";
import { styled } from "styled-components";

import Logo from "./assets/logo512.png";
import Pencil from "./assets/fi-ss-pencil.svg";
import useLolcalState from "./hooks/conserState.js";

const Card = styled.div`
    height: 150px;
    width: 140px;
    margin: 10px;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    /* border: 1px solid; */
    border-radius: 25px;
    box-shadow: 0px 4px 4px 0px rgba(198, 198, 198, 0.05) inset, 0px 4px 4px 0px rgba(0, 0, 0, 0.15);
`;

const MyIput = styled.input`
    background: none;
    border: none;
    width: 100px;
    height: 30px;
    bottom: 10px;
`;

// console.log(global.window.localStorage)
const CardRele = ({ name, value, onChangeState }) => {
    const ref = createRef();
    const [nameValue, setName] = useLolcalState(name, "");
    return (
        <Card>
            <Toggle onChangeState={onChangeState} value={value} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <MyIput
                    ref={ref}
                    type="text"
                    value={nameValue}
                    onChange={(e) => {
                        setName(e.currentTarget.value);
                    }}
                    disabled
                    onBlur={() => (ref.current.disabled = true)}
                />
                <div>
                    <Pencil
                        width="15px"
                        height="15px"
                        onClick={() => {
                            ref.current.disabled = false;
                            ref.current.focus();
                        }}
                    />
                </div>
            </div>
        </Card>
    );
};

function App() {
    const { reles, start, sucess, getState } = useReles();
    return (
        <div className="App">
            <img src={Logo} width="150px" />
            {start ? (
                sucess ? (
                    <Grid>
                        {reles.map((value, i) => (
                            <CardRele
                                key={`toogle-reley-${i}`}
                                name={`name-${i}`}
                                value={value}
                                onChangeState={(e) => {
                                    getState(`rele${i + 1}=${e === true ? "ON" : "OFF"}`);
                                }}
                            />
                        ))}
                    </Grid>
                ) : (
                    <h1>Error ao carregar os dados do RELE</h1>
                )
            ) : (
                <Spinner />
            )}
        </div>
    );
}

export default App;
