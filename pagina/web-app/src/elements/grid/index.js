import React from "react";
import { styled } from "styled-components";

const GridSession = styled.div`
    display: flex;
    width: 100vw;
    max-width: 600px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
`;

const Grid = ({ children }) => {
    return <GridSession>{children}</GridSession>;
};

export default Grid;
