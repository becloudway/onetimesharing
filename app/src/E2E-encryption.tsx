import React, { useState } from "react";
import axios from "axios";

import styled from "styled-components";
import CloudWayLogo from "./assets/logo.png";

import OpenPGP from "./openpgp";

import { ToastContainer } from "react-toastify";
import errorHandling from "./components/errorHandling";
import "react-toastify/dist/ReactToastify.min.css";

import LoadingScreen from "./components/LoadingScreen";
import CopyToClipBoard from "./components/CopyToClipBoard";

function E2Eencryption() {
	const [secret, setSecret] = useState<string>("");
	const [publicKey, setPublicKey] = useState<string>("");
	const [secretURL, setSecretURL] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const postSecret = async (encryptedSecret: string) => {
		setLoading(true);
		await axios
			.post(
				`${window.location.hostname}/api/addE2E`,
				{
					cyphertext: encryptedSecret,
				},
				{
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				}
			)
			.then((res) => {
				setSecretURL(res.data.id);
			})
			.catch((error) => {
				errorHandling(`Error posting secret: ${error}`);
			});
		setLoading(false);
	};

	const encryptSecret = () => {
		OpenPGP.encryptSecret(secret, publicKey)
			.then((encryptedSecret) => {
				postSecret(encryptedSecret);
			})
			.catch((err) => {
				errorHandling(err);
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
				<img className="h-[40px]" src={CloudWayLogo} />
				<div className="mt-[34px] py-[22px] px-[36px] h-[calc(100%-75px)] w-full h-auto max-w-[1400px] rounded-[12px] bg-white">
					<div className="text-[#007BEC] text-[18px] font-bold">Enter the secret</div>
					<input
						type="text"
						placeholder="Enter your secret"
						className="w-full h-[52px] px-[14px] py-[10px]  mt-[6px] rounded-[8px] border-[1px] border-[#007BEC] resize-none"
						value={secret}
						onChange={(e) => setSecret(e.target.value)}
					/>
					<div className="text-[#007BEC] text-[18px] font-bold mt-[12px]">
						Enter the public key that is provided by the recipient of the secret
					</div>
					<textarea
						placeholder="Enter public key here"
						className="w-full h-[240px] px-[14px] py-[10px] mt-[6px] rounded-[8px] border-[1px] border-[#007BEC] resize-none"
						value={publicKey}
						onChange={(e) => setPublicKey(e.target.value)}
					/>
					<button
						onClick={encryptSecret}
						className="mx-auto mt-[20px] text-[14px] font-bold bg-[#007BEC] px-[16px] py-[10px] rounded-[8px] text-white"
					>
						Create a secret
					</button>
					<div className="text-[#007BEC] text-[18px] font-bold mt-[20px]">Send the following link to the recipient</div>
					<div className="relative">
						<CopyToClipBoard text={secretURL && `${window.location.origin}/decrypt?uuid=${secretURL}`} />
						<input
							readOnly
							type="text"
							placeholder="Your secret link will be generated here"
							className="text-center w-full h-[52px] px-[14px] py-[10px]  mt-[6px] rounded-[8px] border-[1px] border-[#007BEC] resize-none"
							value={secretURL && `${window.location.origin}/decrypt?uuid=${secretURL}`}
						/>
					</div>
				</div>
			</div>
		</Container>
	);
}

export default E2Eencryption;

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
