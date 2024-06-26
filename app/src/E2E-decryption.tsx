import React, { useEffect, useState } from "react";
import axios from "axios";

import styled from "styled-components";

import OpenPGP from "./classes/openpgp";

import { ToastContainer } from "react-toastify";
import errorHandling from "./components/errorHandling";
import "react-toastify/dist/ReactToastify.min.css";

import LoadingScreen from "./components/LoadingScreen";
import CopyToClipBoard from "./components/CopyToClipBoard";
import DownloadFile from "./components/DownloadFile";
import Dropdown from "./components/Dropdown";
import ClickableLogo from "./components/ClickableLogo";
import WhiteContainer from "./components/WhiteContainer";
import { Api } from "./classes/api";
import VerifyScreen from "./components/VerifyScreen";
import CloudwayLogo from "./assets/cloudway-logo.png";

function E2Edecryption() {
	const [secret, setSecret] = useState<string>("");
	const [passphrase, setPassPhrase] = useState<string>("");
	const [privateKey, setPrivateKey] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [showBrowserBased, setShowBrowserBased] = useState<boolean>(false);
	const [verify, setVerify] = useState<boolean>(true);

	const getSecret = async (uuid: string) => {
		//Get the secret
		if (uuid && uuid.length !== 0 && uuid !== "" && uuid !== undefined) {
			setLoading(true);
			Api.GetE2ESecret(uuid)
				.then((response) => {
					setSecret(response);
					setLoading(false);
				})
				.catch((err) => {
					errorHandling("No secret was found in combination with this UUID.");
					setLoading(false);
				});
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

	const fetchSecret = () => {
		const searchParams = new URLSearchParams(window.location.search);
		if (searchParams.has("uuid")) {
			getSecret(searchParams.get("uuid") || "");
		} else {
			errorHandling("No uuid found, aborting.");
		}
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
			{verify && (
				<VerifyScreen
					callback={() => {
						setVerify(false);
						fetchSecret();
					}}
				/>
			)}
			<div className="flex flex-col items-center justify-start pt-[34px] px-[12px] w-full h-full overflow-auto pb-[20px] bg-[rgba(0,123,236,0.1)]">
				<ClickableLogo />
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
						<DownloadFile text={secret} />
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
					<WhiteContainer dropdown>
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
					</WhiteContainer>
				</Dropdown>
				<a className="flex items-center justify-center gap-[10px] mt-[20px]" href="https://cloudway.be/">Powered by <img className="h-5" src={CloudwayLogo} /></a>
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
