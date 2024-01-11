import React, { useState } from "react";
import axios from "axios";

import styled from "styled-components";
import OneTimeSharingLogo from "./assets/logo.png";

import AES256 from "./aes-256";

import { ToastContainer } from "react-toastify";
import errorHandling from "./components/errorHandling";
import "react-toastify/dist/ReactToastify.min.css";

import LoadingScreen from "./components/LoadingScreen";
import CopyToClipBoard from "./components/CopyToClipBoard";

function SHEEncryption() {
	const [secret, setSecret] = useState<string>("");
	const [secretURL, setSecretURL] = useState<{ uuid: string; first_half_key: string; iv: string }>({
		uuid: "",
		first_half_key: "",
		iv: "",
	});
	const [loading, setLoading] = useState<boolean>(false);

	const postSecret = async (encryptedSecret: string, first_half_key: string, second_half_key: string, iv: string) => {
		setLoading(true);
		await axios
			.post(
				`/api/addSHE`,
				{
					cyphertext: encryptedSecret,
					second_half_key: second_half_key,
				},
				{
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				}
			)
			.then((res) => {
				setSecretURL({
					uuid: res.data.id,
					first_half_key: first_half_key,
					iv: iv,
				});
			})
			.catch((error) => {
				errorHandling(`Error posting secret: ${error}`);
			});
		setLoading(false);
	};

	const encryptSecret = async () => {
		if (!secret) {
			errorHandling("Please enter a secret");
			return;
		}

		await AES256.encryptSecret(secret).then((res) => {
			postSecret(res.encrypted, res.key.slice(0, 32), res.key.slice(32, 64), res.iv);
		});
	};

	return (
		<Container className="bg-white">
			<LoadingScreen show={loading} />
			<ToastContainer
				position="bottom-right"
				autoClose={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				theme="colored"
			/>
			<div className="flex flex-col items-center justify-start pt-[34px] w-full h-full bg-[rgba(0,123,236,0.1)]">
				<img className="h-[40px]" src={OneTimeSharingLogo} />
				<div className="mt-[34px] py-[22px] px-[36px] h-[calc(100%-75px)] w-full h-auto max-w-[1400px] rounded-[12px] bg-white">
					<div className="text-[#007BEC] text-[18px] font-bold">Enter the secret</div>
					<input
						type="text"
						placeholder="Enter your secret"
						className="w-full h-[52px] px-[14px] py-[10px]  mt-[6px] rounded-[8px] border-[1px] border-[#007BEC] resize-none"
						value={secret}
						onChange={(e) => setSecret(e.target.value)}
					/>
					<button
						onClick={encryptSecret}
						className="mx-auto mt-[20px] text-[14px] font-bold bg-[#007BEC] px-[16px] py-[10px] rounded-[8px] text-white"
					>
						Create a secret
					</button>
					<div className="text-[#007BEC] text-[18px] font-bold mt-[12px]">Send the following link to the recipient</div>
					<div className="relative">
						<CopyToClipBoard
							text={`${window.location.origin}/decryptSHE?uuid=${secretURL.uuid}\#first_half_key=${secretURL.first_half_key}&iv=${secretURL.iv}`}
						/>
						<input
							readOnly
							type="text"
							placeholder="Your secret link will be generated here"
							className="text-center w-full h-[52px] px-[14px] py-[10px]  mt-[6px] rounded-[8px] border-[1px] border-[#007BEC] resize-none"
							value={
								secretURL.uuid &&
								`${window.location.origin}/decryptSHE?uuid=${secretURL.uuid}#first_half_key=${secretURL.first_half_key}&iv=${secretURL.iv}`
							}
						/>
					</div>
				</div>
			</div>
		</Container>
	);
}

export default SHEEncryption;

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
