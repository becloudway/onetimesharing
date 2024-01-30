import React, { useEffect, useState } from "react";
import styled from "styled-components";

import axios from "axios";

const Login = () => {
	const searchParams = new URLSearchParams(window.location.search);
	const code = searchParams.has("code") ? searchParams.get("code") : null;
	const [json, setJSON] = useState<string | undefined>(undefined);

	const cognitoDomain = "https://bolleje-test-cog.auth.eu-west-1.amazoncognito.com/oauth2/token";
	const data = {
		grant_type: "authorization_code",
		client_id: "6em5dl9o2eak3d7mb0k9d7ajma",
		redirect_uri: "http://localhost:9000/login",
	};

	useEffect(() => {
		if (!code) return;

		axios
			.post(
				cognitoDomain,
				new URLSearchParams({
					...data,
					code: code,
				}),
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				}
			)
			.then((response) => setJSON(JSON.stringify(response.data, undefined, 1)))
			.catch((error) => console.error(error.response.data));
	}, []);

	const logout = () => {
		window.location.href = `https://bolleje-test-cog.auth.eu-west-1.amazoncognito.com/logout?client_id=${data.client_id}&logout_uri=http://localhost:9000/`;
	};

	return (
		<Container>
			<h1>{code ? code : "No code has been found."}</h1>
			<textarea cols={30} rows={10} value={json} style={{ width: "100%", minHeight: "30rem", lineHeight: "1.2" }}></textarea>
			<button onClick={logout}>Logout</button>
		</Container>
	);
};

export default Login;

const Container = styled.div`
	width: 100vw;
	height: 100vh;

	display: flex;
	flex-direction: column;

	& * {
		margin-inline: auto;
	}
`;
