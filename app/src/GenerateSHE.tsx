import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import CloudWayLogo from "./assets/logo.png";

import AES from "crypto-js/aes";
import SHA256 from "crypto-js/sha256";

import AES256 from "./aes-256";

function GenerateSHE() {
	const [secret, setSecret] = useState<string>("");
	const [secretURL, setSecretURL] = useState<string>("");

	useEffect(() => {
		new Promise(async (resolve, reject) => {
			let resp: any;

			await AES256.encryptSecret("dit is een test")
				.then((res) => {
					resp = res;
				})
				.catch((err) => {
					console.log(err);
				});

			console.log(resp);
			if (!resp) return;

			await AES256.decryptSecret(resp.encrypted, resp.key, resp.iv)
				.then((res) => {
					console.log(res);
				})
				.catch((err) => {
					console.log(err);
				});
		});
	});

	return (
		<Container className="bg-white">
			<div className="flex flex-col items-center justify-start pt-[34px] w-full h-full bg-[rgba(0,123,236,0.1)]">
				<img className="h-[40px]" src={CloudWayLogo} />
				<div className="flex flex-col mt-[34px] py-[30px] px-[36px] w-full max-w-[1400px] rounded-[12px] bg-white">
					<div className="text-[#007BEC] text-[18px] font-bold">Enter the secret</div>
					<input
						type="text"
						placeholder="Enter your secret"
						className="w-full h-[36px] px-[14px] py-[10px]  mt-[6px] rounded-[8px] border-[1px] border-[#007BEC] resize-none"
						value={secret}
						onChange={(e) => setSecret(e.target.value)}
					/>
					<button className="mx-auto mt-[20px] text-[14px] font-bold bg-[#007BEC] px-[16px] py-[10px] rounded-[8px] text-white">
						Create a secret
					</button>
					<div className="text-[#007BEC] text-[18px] font-bold mt-[12px]">Send the following link to the recipient</div>
					<input
						readOnly
						type="text"
						placeholder="Your secret link will be generated here"
						className="text-center w-full h-[36px] px-[14px] py-[10px]  mt-[6px] rounded-[8px] border-[1px] border-[#007BEC] resize-none"
						value={secretURL && `http://localhost:9000/decrypt?uuid=${secretURL}`}
					/>
				</div>
			</div>
		</Container>
	);
}

export default GenerateSHE;

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
