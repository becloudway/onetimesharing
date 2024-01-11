import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CloudWayLogo from "./assets/logo.png";
import { ReactComponent as WarningIcon } from "./assets/warning-icon.svg";
import InfoBox from "./components/InfoBox";

import OpenPGP from "./openpgp";

import { ToastContainer } from "react-toastify";
import errorHandling from "./components/errorHandling";
import "react-toastify/dist/ReactToastify.min.css";

import CopyToClipBoard from "./components/CopyToClipBoard";
import Dropdown from "./Dropdown";

function KeyGenerator() {
	const [passCode, setPassCode] = useState<string>("");
	const [publicKey, setPublicKey] = useState<string>("");
	const [privateKey, setPrivateKey] = useState<string>("");
	const [showBrowserBased, setShowBrowserBased] = useState<boolean>(false);

	const generateKeyPair = () => {
		if (!passCode || passCode.length === 0 || passCode === "" || passCode === undefined) {
			errorHandling("Please enter a passphrase");
			return;
		}

		OpenPGP.generateKeyPair(passCode)
			.then((keyPair: any) => {
				setPublicKey(keyPair.publicKey);
				setPrivateKey(keyPair.privateKey);
				navigator.clipboard.writeText(keyPair.publicKey);

				// Optionally, you may want to clear the passphrase after generating the key pair.
				setPassCode("");

				// Optionally, you may want to show a success message or perform other actions.
				// alert("Key pair generated successfully!");
			})
			.catch((err) => {
				errorHandling(err.message);
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
			<div className="flex flex-col items-center justify-start pt-[34px] px-[12px] w-full h-full overflow-auto pb-[20px] bg-[rgba(0,123,236,0.1)]">
				<img className="h-[40px]" src={CloudWayLogo} />
				<div className="mt-[34px] py-[22px] px-[36px] h-[calc(100%-75px)] w-full h-auto max-w-[1400px] rounded-[12px] bg-white">
					<div className="text-[20px] font-bold">1. Install GPG</div>
					<br />
					<ul>
						<li>
							<b>1. Debian based systems:</b> <code>sudo apt-get install gnupg</code>
						</li>
						<li>
							<b>2. OS X (Mac) systems:</b> <code>brew install gnupg</code>
						</li>
						<li>
							<b>3. Windows based systems:</b> Download and install the Gpg4win application{" "}
							<a className="text-blue-500 hover:underline" target="_blank" href="https://www.gpg4win.org/get-gpg4win.html">
								here
							</a>
						</li>
					</ul>
					<br />
					<div className="text-[20px] font-bold mt-[12px]">2. Generate a keypair</div>
					<br />
					<ul>
						<li>
							<b>To generate a keypair enter the following command:</b> <code>gpg --generate-key</code> and follow the prompts (Make sure
							that the email entered is unique!).
						</li>
					</ul>
					<br />
					<div className="text-[20px] font-bold mt-[12px]">3. Fetch the public key.</div>
					<br />
					<ul>
						<li>
							<b>Retrieve the public key: </b>
							<code>gpg --output public.pgp --armor --export test@test.com</code> and replace test@test.com to the email address that you
							used to generate the key.
						</li>
					</ul>
					<br />
					<div className="text-[20px] font-bold mt-[12px]">4. Send the public key to the sender of the secret</div>
					<br />
					<ul>
						<li>
							The key is defined in the output file <code>public.pgp</code> that was generated above.
						</li>
					</ul>
				</div>
				<Dropdown
					title="Browser-based generation"
					show={showBrowserBased}
					toggle={() => {
						setShowBrowserBased(!showBrowserBased);
					}}
				>
					<div className="py-[22px] px-[36px] h-[calc(100%-75px)] w-full h-auto max-w-[1400px] rounded-b-lg-[12px] bg-white">
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
				</Dropdown>
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

	code {
		font-family: "Courier New", monospace; /* Set a monospaced font for code */
		background-color: #f4f4f4; /* Set a background color for better visibility */
		padding: 2px 4px; /* Add padding to the code */
		border: 1px solid #ccc; /* Add a border for better separation */
		border-radius: 4px; /* Add rounded corners */
		color: #333; /* Set the text color */
	}
`;
