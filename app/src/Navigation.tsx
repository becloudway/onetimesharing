import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import OneTimeSharingLogo from "./assets/logo.png";

import { ReactComponent as OneClickIcon } from "./assets/oneclickicon.svg";
import { ReactComponent as PKIIcon } from "./assets/pkiicon.svg";
import { ReactComponent as KeyIcon } from "./assets/keypairicon.svg";
import { Api } from "./classes/api";

const Navigation = () => {
	const navigate = useNavigate();
	const [loggedIn, setLoggedIn] = useState<boolean>(false);

	useEffect(() => {
		const cookie = window.localStorage.getItem("isLoggedIn") || false;
		console.log(cookie);
		setLoggedIn(cookie !== false ? true : false);
	}, []);

	return (
		<Container>
			<div className="flex flex-col items-center justify-center gap-[40px] pt-[34px] w-full h-full bg-[rgba(0,123,236,0.1)]">
				<img className="h-[40px]" src={OneTimeSharingLogo} />
				<div className="flex flex-col gap-[20px] max-w-[600px] w-full px-[10px]">
					{!loggedIn && (
						<button
							className="w-full h-[60px] bg-white rounded-md shadow border border-stone-300 flex justify-center items-center gap-[12px]"
							onClick={() => {
								navigate("/callback");
							}}
						>
							Login
						</button>
					)}
					{loggedIn && <div onClick={() => {
						window.localStorage.removeItem("isLoggedIn");
						window.location.reload();
					}} className="text-center font-bold text-[18px]">You are logged in</div>}
					<div className="flex flex-wrap gap-[20px]">
						<button
							className="w-full mx-auto max-w-[278px] h-[120px] bg-white rounded-md shadow border border-stone-300 flex justify-center items-center gap-[12px]"
							onClick={() => {
								navigate("/encryptshe");
							}}
						>
							<OneClickIcon />
							OneClick sharing
						</button>
						<button
							className="w-full mx-auto max-w-[278px] h-[120px] bg-white rounded-md shadow border border-stone-300 flex justify-center items-center gap-[12px]"
							onClick={() => {
								navigate("/encrypt");
							}}
						>
							<PKIIcon />
							PKI encryption
						</button>
					</div>
					<button
						className="w-full h-[120px] bg-white rounded-md shadow border border-stone-300 flex justify-center items-center gap-[12px]"
						onClick={() => {
							navigate("/keygenerator");
						}}
					>
						<KeyIcon />
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
