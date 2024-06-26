import React, { useState, useEffect } from "react";

import styled from "styled-components";

import OpenPGP from "./classes/openpgp";

import { ToastContainer } from "react-toastify";
import errorHandling from "./components/errorHandling";
import "react-toastify/dist/ReactToastify.min.css";

import LoadingScreen from "./components/LoadingScreen";
import CopyToClipBoard from "./components/CopyToClipBoard";
import ClickableLogo from "./components/ClickableLogo";
import { Api } from "./classes/api";
import CloudwayLogo from "./assets/cloudway-logo.png";

function E2Eencryption() {
	const [secret, setSecret] = useState<string>("");
	const [publicKey, setPublicKey] = useState<string>("");
	const [loadedPublicKey, setLoadedPublicKey] = useState<string>("");
	const [secretURL, setSecretURL] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const postSecret = async (encryptedSecret: string) => {
		setLoading(true);
		Api.PostE2ESecret(encryptedSecret, loadedPublicKey)
			.then((response) => {
				setSecretURL(response);
				setLoading(false);
			})
			.catch((err) => {
				errorHandling(err);
				setLoading(false);
			});
	};

	const encryptSecret = () => {
		OpenPGP.encryptSecret(secret, publicKey)
			.then((encryptedSecret) => {
				postSecret(encryptedSecret);
			})
			.catch((err) => {
				errorHandling(err.message);
			});
	};

	const getPublicKey = (uuid: string) => {
		setLoading(true);
		Api.GetPublicKey(uuid)
			.then((response) => {
				setLoadedPublicKey(uuid);
				setPublicKey(response);
				setLoading(false);
			})
			.catch((err) => {
				errorHandling(err);
				setLoading(false);
			});
	};

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		if (searchParams.has("uuid")) {
			getPublicKey(searchParams.get("uuid") || "");
		}
	}, []);

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
			<div className="flex flex-col items-center justify-start pt-[34px] w-full h-full overflow-auto pb-[20px] bg-[rgba(0,123,236,0.1)]">
				<ClickableLogo />
				<div className="mt-[34px] py-[22px] px-[36px] h-[calc(100%-75px)] w-full h-auto max-w-[1400px] rounded-[12px] bg-white">
					<div className="text-[#007BEC] text-[18px] font-bold">Enter the secret</div>
					<textarea
						placeholder="Enter your secret"
						className="w-full h-[240px] px-[14px] py-[10px]  mt-[6px] rounded-[8px] border-[1px] border-[#007BEC] resize-none"
						value={secret}
						onChange={(e) => setSecret(e.target.value)}
					></textarea>
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
				<a className="flex items-center justify-center gap-[10px] mt-[20px]" href="https://cloudway.be/">Powered by <img className="h-5" src={CloudwayLogo} /></a>
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
