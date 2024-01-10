import React from "react";
import styled from "styled-components";
import OneTimeSharingLogo from "./assets/logo.png";

const Navigation = () => {
	return (
		<Container>
			<div className="flex flex-col items-center justify-center pt-[34px] w-full h-full bg-[rgba(0,123,236,0.1)]">
				<img className="h-[40px]" src={OneTimeSharingLogo} />
			</div>
		</Container>
	);
};

export default Navigation;

const Container = styled.div`
	width: 100vw;
	height: 100vh;

	overflow: auto;

	textarea {
		outline: none;
	}

	input {
		outline: none;
	}
`;
