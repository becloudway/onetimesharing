import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import OneTimeSharingLogo from "./assets/logo.png";

const Navigation = () => {
	const navigate = useNavigate();

	return (
		<Container>
			<div className="flex flex-col items-center justify-center gap-[40px] pt-[34px] w-full h-full bg-[rgba(0,123,236,0.1)]">
				<img className="h-[40px]" src={OneTimeSharingLogo} />
				<div className="flex flex-col gap-[20px] max-w-[600px] w-full px-[10px]">
					<div className="flex flex-wrap gap-[20px]">
						<button
							className="w-full mx-auto max-w-[278px] h-[120px] bg-white rounded-md shadow border border-stone-300"
							onClick={() => {
								navigate("/encryptshe");
							}}
						>
							SHE encryption
						</button>
						<button
							className="w-full mx-auto max-w-[278px] h-[120px] bg-white rounded-md shadow border border-stone-300"
							onClick={() => {
								navigate("/encrypt");
							}}
						>
							PKI encryption
						</button>
					</div>
					<button
						className="w-full h-[120px] bg-white rounded-md shadow border border-stone-300"
						onClick={() => {
							navigate("/keygenerator");
						}}
					>
						Key Generator
					</button>
				</div>
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
