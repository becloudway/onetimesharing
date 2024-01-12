import React, { useEffect, useState } from "react";
import axios from "axios";

import styled from "styled-components";
import CloudWayLogo from "./assets/logo.png";

import OpenPGP from "./openpgp";

import { ToastContainer } from "react-toastify";
import errorHandling from "./components/errorHandling";
import "react-toastify/dist/ReactToastify.min.css";

import LoadingScreen from "./components/LoadingScreen";
import CopyToClipBoard from "./components/CopyToClipBoard";
import Dropdown from "./Dropdown";

function E2Edecryption() {
	const [secret, setSecret] = useState<string>("");
	const [passphrase, setPassPhrase] = useState<string>("");
	const [privateKey, setPrivateKey] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [showBrowserBased, setShowBrowserBased] = useState<boolean>(false);

	const getSecret = async (uuid: string) => {
		//Get the secret
		if (uuid && uuid.length !== 0 && uuid !== "" && uuid !== undefined) {
			setLoading(true);
			await axios
				.get(`/api/getE2E/${uuid}`, {
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				})
				.then((res) => {
					setSecret(res.data.cyphertext);
				})
				.catch((error) => {
					errorHandling("Error getting secret: " + error.message);
				});
			setLoading(false);
		}
	};

	const decryptSecret = () => {
		OpenPGP.decryptSecret(secret, privateKey, passphrase)
			.then((decryptedSecret) => {
				setSecret(decryptedSecret);
			})
			.catch((err) => {
				errorHandling(err.message);
			});
	};

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		if (searchParams.has("uuid")) {
			getSecret(searchParams.get("uuid") || "");
		} else {
			errorHandling("No uuid found, aborting.");
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
			<div className="flex flex-col items-center justify-start pt-[34px] px-[12px] w-full h-full overflow-auto pb-[20px] bg-[rgba(0,123,236,0.1)]">
				<img className="h-[40px]" src={CloudWayLogo} />
				<div className="mt-[34px] py-[22px] px-[36px] h-[calc(100%-75px)] w-full h-auto max-w-[1400px] rounded-[12px] bg-white">
					<div className="text-[20px] font-bold mt-[12px]">1. Get the encrypted message from below.</div>
					<br />
					<ul>
						<li>
							<b>Paste this message in a </b>
							<code>xxxx.gpg</code> file where you switch the xxxx to a name of your choice.
						</li>
					</ul>
					<br />
					<div className="text-[20px] font-bold mt-[12px]">2. Decrypt the secret</div>
					<br />
					<ul>
						<li>
							<b>To decrypt the secret enter the following command:</b> <code>gpg --output xxxx --decrypt doc.gpg</code> make sure to enter
							this command in the same directory where you stored .gpg file you made above and change the xxxx with a name of your choice.
						</li>
						<br />
						<li>
							<b>If the decryption was successful, you will find the secret in the file you specified in the command above.</b>
						</li>
					</ul>
				</div>
				<div className="mt-[34px] py-[22px] px-[36px] h-[calc(100%-75px)] w-full h-auto max-w-[1400px] rounded-[12px] bg-white">
					<div className="text-[#007BEC] text-[18px] font-bold">Secret:</div>
					<div className="relative">
						<CopyToClipBoard text={secret} />
						<textarea
							readOnly
							placeholder="Your secret will be displayed here."
							className="w-full h-[240px] px-[14px] py-[10px] mt-[6px] rounded-[8px] border-[1px] border-[#007BEC] resize-none"
							value={secret}
						/>
					</div>
				</div>
				<Dropdown
					title="Browser-based decryption"
					show={showBrowserBased}
					toggle={() => {
						setShowBrowserBased(!showBrowserBased);
					}}
				>
					<div className="py-[22px] px-[36px] h-[calc(100%-75px)] w-full h-auto max-w-[1400px] rounded-b-lr-[12px] bg-white">
						<div className="text-[#EC0000] text-[18px] font-bold">Enter your passphrase</div>
						<input
							type="text"
							placeholder="Enter your passphrase"
							className="w-full h-[52px] px-[14px] py-[10px]  mt-[6px] rounded-[8px] border-[1px] border-[#EC0000] resize-none"
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
					</div>
				</Dropdown>
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
