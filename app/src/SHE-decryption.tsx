import React, { useEffect, useState } from "react";
import axios from "axios";
import getAPIURL from "./getAPIURL";

import styled from "styled-components";
import CloudWayLogo from "./assets/logo.png";

import AES256 from "./aes-256";

function SHEDecryption() {
	const [secret, setSecret] = useState<string>("");

	const getSecret = async (uuid: string, first_half_key: string, iv: string) => {
		//Get the secret
		if (uuid && uuid.length !== 0 && uuid !== "" && uuid !== undefined) {
			await axios
				.get(`${getAPIURL()}/getSHE/${uuid}`, {
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				})
				.then((res: { data: { cyphertext: string; second_half_key: string; iv: string } }) => {
					decryptSecret(res.data.cyphertext, `${first_half_key}${res.data.second_half_key}`, iv);
				})
				.catch((error) => {
					alert("Error getting secret: " + error);
				});
		}
	};

	const decryptSecret = (cyphertext: string, second_half_key: string, iv: string) => {
		console.log("Decrypting");
		AES256.decryptSecret(cyphertext, second_half_key, iv)
			.then((decryptedSecret) => {
				setSecret(decryptedSecret);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleParamsCheck = (params: { uuid: string; first_half_key: string; iv: string }) => {
		return new Promise((resolve, reject) => {
			if (params.uuid.length === 0 || params.uuid === "" || params.uuid === undefined) {
				reject("No uuid provided");
			}
			if (params.first_half_key.length === 0 || params.first_half_key === "" || params.first_half_key === undefined) {
				reject("No first_half_key provided");
			}
			if (params.iv.length === 0 || params.iv === "" || params.iv === undefined) {
				reject("No iv provided");
			}

			resolve(true);
		});
	};

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const params = {
			uuid: searchParams.get("uuid") || "",
			first_half_key: searchParams.get("first_half_key") || "",
			iv: searchParams.get("iv") || "",
		};

		handleParamsCheck(params)
			.then((check) => {
				if (check) {
					getSecret(params.uuid, params.first_half_key, params.iv);
				}
			})
			.catch((error) => {
				alert("Error checking params: " + error);
			});
	}, []);

	return (
		<Container className="bg-white">
			<div className="flex flex-col items-center justify-start pt-[34px] w-full h-full bg-[rgba(0,123,236,0.1)]">
				<img className="h-[40px]" src={CloudWayLogo} />
				<div className="mt-[34px] py-[22px] px-[36px] h-[calc(100%-75px)] w-full h-auto max-w-[1400px] rounded-[12px] bg-white">
					<div className="text-[#007BEC] text-[18px] font-bold">Secret:</div>
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

export default SHEDecryption;

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
