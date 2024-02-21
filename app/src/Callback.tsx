import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Api } from "./classes/api";
import { useNavigate } from "react-router-dom";

const Callback = () => {
	const searchParams = new URLSearchParams(window.location.search);
	const navigate = useNavigate();

	useEffect(() => {
		const code = searchParams.has("code") ? searchParams.get("code") : "";
		const logout = searchParams.has("logout") ? searchParams.get("logout") : false;

		if (!logout) {
			Api.Login(code)
				.then((response) => {
					if (response.status === 302) window.location.href = response.data;
					if (response.status === 200) {
						window.localStorage.setItem("isLoggedIn", response.data.loggedIn);
						navigate("/");
					}
				})
				.catch((error) => {
					navigate("/");
				});
		} else if (logout) {
			Api.Logout()
				.then((response: any) => {
					if (response.status === 200) {
						window.localStorage.setItem("isLoggedIn", response.data.loggedIn);
						navigate("/");
					}
				})
				.catch((err) => {
					navigate("/");
				});
		}
	}, []);

	return (
		<div className="w-[100vw] h-[100vh] flex">
			<LoadingText className="mx-auto my-auto text-[26px] font-medium">
				Redirecting <span>.</span>
				<span>.</span>
				<span>.</span>
			</LoadingText>
		</div>
	);
};

export default Callback;

const Container = styled.div`
	width: 100vw;
	height: 100vh;

	display: flex;
	flex-direction: column;

	& * {
		margin-inline: auto;
	}
`;

const LoadingText = styled.div`
	@keyframes blink {
		0% {
			opacity: 0.2;
		}
		20% {
			opacity: 1;
		}
		100% {
			opacity: 0.2;
		}
	}

	& span {
		animation-name: blink;
		animation-duration: 1.4s;
		animation-iteration-count: infinite;
		animation-fill-mode: both;
	}

	& span:nth-child(2) {
		animation-delay: 0.2s;
	}

	& span:nth-child(3) {
		animation-delay: 0.4s;
	}
`;
