import React, { useState, useEffect } from "react";
import styled from "styled-components";
import OneTimeSharingLogo from "./assets/logo.png";
import { ReactComponent as WarningIcon } from "./assets/warning-icon.svg";
import InfoBox from "./components/InfoBox";

import OpenPGP from "./openpgp";

import { ToastContainer } from "react-toastify";
import errorHandling from "./components/errorHandling";
import "react-toastify/dist/ReactToastify.min.css";

import CopyToClipBoard from "./components/CopyToClipBoard";

function KeyGenerator() {
	const [passCode, setPassCode] = useState<string>("");
	const [publicKey, setPublicKey] = useState<string>("");
	const [privateKey, setPrivateKey] = useState<string>("");

	const generateKeyPair = () => {
		if (!passCode || passCode.length === 0 || passCode === "" || passCode === undefined) {
			errorHandling("Please enter a passphrase");
			return;
		}

		OpenPGP.generateKeyPair(passCode).then((keyPair: any) => {
			setPublicKey(keyPair.publicKey);
			setPrivateKey(keyPair.privateKey);
			navigator.clipboard.writeText(keyPair.publicKey);

			// Optionally, you may want to clear the passphrase after generating the key pair.
			setPassCode("");

			// Optionally, you may want to show a success message or perform other actions.
			// alert("Key pair generated successfully!");
		});
	};

	return (
		<Container className="bg-white">
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
					<InfoBox
						text="The private key that is shown below is not to be shared under any circumstances and is only shown once. So please keep it safe in a
			password manager for example. This keypair can be reused for sharing secrets indefinitely. Meaning the private key can be reused
			unless it is compromised."
						Icon={WarningIcon}
						type="warning"
					/>
					<div className="text-[#EC0000] text-[18px] font-bold mt-[12px]">Passphrase</div>
					<input
						type="text"
						placeholder="Please fill in a passphrase in order to generate a PGP keypair"
						className="w-full h-[36px] px-[14px] py-[10px]  mt-[6px] rounded-[8px] border-[1px] border-[#EC0000] resize-none"
						value={passCode}
						onChange={(e) => setPassCode(e.target.value)}
					/>
					<div className="text-[#EC0000] text-[18px] font-bold mt-[12px]">Private key (Read-only)</div>
					<div className="relative">
						<textarea
							readOnly
							placeholder="Private key"
							className="w-full h-[240px] px-[14px] py-[10px] mt-[6px] rounded-[8px] border-[1px] border-[#EC0000] resize-none"
							value={privateKey}
						/>
						<CopyToClipBoard text={privateKey} />
					</div>
					<div className="text-[#007BEC] text-[18px] font-bold mt-[12px]">
						Public key (Give this key to the secret provider) (Read-only)
					</div>
					<div className="relative">
						<textarea
							readOnly
							placeholder="Public key"
							className="w-full h-[240px] px-[14px] py-[10px]  mt-[6px] rounded-[8px] border-[1px] border-[#007BEC] resize-none"
							value={publicKey}
						/>
						<CopyToClipBoard text={publicKey} />
					</div>
					<button
						onClick={generateKeyPair}
						className="mt-[20px] text-[14px] font-bold bg-[#007BEC] px-[16px] py-[10px] rounded-[8px] text-white"
					>
						Generate a new PGP keypair
					</button>
				</div>
			</div>
		</Container>
	);
}

export default KeyGenerator;

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
