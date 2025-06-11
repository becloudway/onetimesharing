import React from "react";
import styled from "styled-components";
import { ReactComponent as ShowIcon } from "../assets/show-password.svg";
import { ReactComponent as HideIcon } from "../assets/hide-password.svg";

interface IShowHidePassword {
    show: boolean
    onClick: () => void;
}

const ShowHidePassword = ({ show, onClick }: IShowHidePassword) => {
    return (
        <button
            onClick={onClick}
            className={`absolute right-[6px] top-[12px] rounded-[8px] focus:outline-none px-2 py-2 cursor-pointer`}
        >
            {
                show ? <StyledHideIcon /> : <StyledShowIcon />
            }
        </button>
    );
};

export default ShowHidePassword;

const StyledShowIcon = styled(ShowIcon)`
    & path {
        stroke:rgb(169, 184, 206);
    }
`;

const StyledHideIcon = styled(HideIcon)`
    & path {
        stroke:rgb(169, 184, 206);
    }
`;