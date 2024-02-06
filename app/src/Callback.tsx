import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Api } from "./classes/api";
import { useNavigate } from "react-router-dom";

const Callback = () => {
	const searchParams = new URLSearchParams(window.location.search);
	const navigate = useNavigate();

	useEffect(() => {
		const code = searchParams.has("code") ? searchParams.get("code") : "";

		Api.Login(code)
			.then((response) => {
				window.location.href = response;
			})
			.catch((error) => {
				navigate("/");
			});
	}, []);

	return <></>;
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
