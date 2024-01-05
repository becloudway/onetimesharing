import React, { useEffect, useState } from "react";
import axios from "axios";
import getAPIURL from "./getAPIURL";

import styled from "styled-components";
import CloudWayLogo from "./assets/logo.png";

import OpenPGP from "./openpgp";

function E2Edecryption() {
	const [secret, setSecret] = useState<string>("");
	const [passphrase, setPassPhrase] = useState<string>("");
	const [privateKey, setPrivateKey] = useState<string>("");

	const getSecret = (uuid: string) => {
		//Get the secret
		if (uuid && uuid.length !== 0 && uuid !== "" && uuid !== undefined) {
			axios
				.get(`${getAPIURL()}/getE2E/${uuid}`, {
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				})
				.then((res) => {
					setSecret(res.data.cyphertext);
				})
				.catch((error) => {
					alert("Error getting secret: " + error);
				});
		}
	};

	const decryptSecret = () => {
		OpenPGP.decryptSecret(secret, privateKey, passphrase).then((decryptedSecret) => {
			setSecret(decryptedSecret);
		});
	};

	const handleEnter = (event: { key: string }) => {
		if (event.key === "Enter") {
			//Also decrypt the secret
			alert("Pressed enter");
		}
	};

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		if (searchParams.has("uuid")) {
			getSecret(searchParams.get("uuid") || "");
		} else {
			alert("No uuid found");
		}
	}, []);

	return (
		<Container className="bg-white">
			<div className="flex flex-col items-center justify-start pt-[34px] w-full h-full bg-[rgba(0,123,236,0.1)]">
				<img className="h-[40px]" src={CloudWayLogo} />
				<div className="mt-[34px] py-[22px] px-[36px] h-[calc(100%-75px)] w-full h-auto max-w-[1400px] rounded-[12px] bg-white">
					<div className="text-[#EC0000] text-[18px] font-bold">Enter your passphrase</div>
					<input
						type="text"
						placeholder="Enter your passphrase"
						className="w-full h-[36px] px-[14px] py-[10px]  mt-[6px] rounded-[8px] border-[1px] border-[#EC0000] resize-none"
						value={passphrase}
						onChange={(e) => setPassPhrase(e.target.value)}
					/>
					<div className="text-[#EC0000] text-[18px] font-bold mt-[12px]">Enter your private key to decrypt the secret</div>
					<textarea
						placeholder="Enter your private key"
						className="w-full h-[240px] px-[14px] py-[10px] mt-[6px] rounded-[8px] border-[1px] border-[#EC0000] resize-none"
						value={privateKey}
						onChange={(e) => setPrivateKey(e.target.value)}
					/>
					<button
						onClick={decryptSecret}
						className="mx-auto mt-[20px] text-[14px] font-bold bg-[#007BEC] px-[16px] py-[10px] rounded-[8px] text-white"
					>
						Decrypt the secret
					</button>
					<div className="text-[#007BEC] text-[18px] font-bold mt-[12px]">Secret:</div>
					<textarea
						readOnly
						placeholder="Your secret will be displayed here."
						className="w-full h-[240px] px-[14px] py-[10px] mt-[6px] rounded-[8px] border-[1px] border-[#007BEC] resize-none"
						value={secret}
					/>
				</div>
			</div>
		</Container>
	);
}

export default E2Edecryption;

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
