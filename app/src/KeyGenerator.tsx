import React, { useState, useRef } from "react";
import styled from "styled-components";
import { ReactComponent as WarningIcon } from "./assets/warning-icon.svg";
import InfoBox from "./components/InfoBox";

import OpenPGP from "./classes/openpgp";

import { ToastContainer } from "react-toastify";
import errorHandling from "./components/errorHandling";
import "react-toastify/dist/ReactToastify.min.css";

import CopyToClipBoard from "./components/CopyToClipBoard";
import Dropdown from "./components/Dropdown";
import ClickableLogo from "./components/ClickableLogo";
import WhiteContainer from "./components/WhiteContainer";
import LoadingScreen from "./components/LoadingScreen";
import { Api } from "./classes/api";

function KeyGenerator() {
	const [passCode, setPassCode] = useState<string>("");
	const [publicKey, setPublicKey] = useState<string>("");
	const [privateKey, setPrivateKey] = useState<string>("");
	const [publicKeyID, setPublicKeyID] = useState<string>("");
	const [showSharePublicKey, setShowSharePublicKey] = useState<boolean>(false);
	const [showBrowserBased, setShowBrowserBased] = useState<boolean>(false);

	const [inputPublicKey, setInputPublicKey] = useState<string>("");
	const [loadedPublicKey, setLoadedPublicKey] = useState<string>("");

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [fileName, setFileName] = useState<string>("");

	const [loading, setLoading] = useState<boolean>(false);

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

	const sharePublicKey = () => {
		setLoading(true);

		if ((!loadedPublicKey && !inputPublicKey) || (loadedPublicKey === "" && inputPublicKey === "")) {
			errorHandling("Please enter a public key");
			setLoading(false);
			return;
		}

		Api.PostPublicKey(loadedPublicKey ? loadedPublicKey : inputPublicKey)
			.then((response) => {
				setPublicKeyID(response);
				setLoading(false);
			})
			.catch((err) => {
				errorHandling(err.message);
				setLoading(false);
			});
	};

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!fileInputRef.current) return;
		if (!fileInputRef.current.files) return;

		const fileName = fileInputRef.current.files[0].name;
		if (!fileName) return;

		setFileName(fileName);
		handleFile(event, fileInputRef.current.files[0]);
	};

	const handleFile = (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLInputElement>, file: any) => {
		OpenPGP.handleFile(file)
			.then((key: any) => {
				setLoadedPublicKey(key);
			})
			.catch((err) => {
				errorHandling(err.message);
			});
	};

	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLInputElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e: React.DragEvent<HTMLInputElement>) => {
		e.preventDefault();
		e.stopPropagation();

		const file = e.dataTransfer.files[0];
		if (file) {
			setFileName(file.name);
			handleFile(e, file);
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
			<div className="flex flex-col items-center justify-start pt-[34px] px-[12px] w-full h-full overflow-auto pb-[20px] bg-[rgba(0,123,236,0.1)]">
				<ClickableLogo />
				<WhiteContainer>
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
				</WhiteContainer>
				<WhiteContainer>
					<div className="text-[20px] font-bold">Share your public key</div>
					<div className="relative w-full h-[100px] my-[16px]">
						<div
							className="w-full h-full flex items-center justify-center text-slate-400 border-1 border-slate-400 outline-dashed hover:text-slate-800 hover:border-slate-800 cursor-pointer rounded font-bold"
							onClick={handleButtonClick}
							onDragOver={handleDragOver}
							onDrop={handleDrop}
						>
							{fileName ? fileName : "Click here to select a public key"}
						</div>
						<input className="absolute" type="file" ref={fileInputRef} onChange={handleFileSelect} />
					</div>
					<Dropdown
						disableMargin
						innerDropdown
						title="Paste public key"
						show={showSharePublicKey}
						toggle={() => {
							setShowSharePublicKey(!showSharePublicKey);
						}}
					>
						<WhiteContainer dropdown disableBackground>
							<div className="text-[#007BEC] text-[18px] font-bold">
								You can alternatively paste your secret here to generate a sharable link.
							</div>
							<textarea
								placeholder="Enter public key here"
								className="w-full h-[240px] px-[14px] py-[10px] mt-[6px] rounded-[8px] border-[1px] border-[#007BEC] resize-none"
								value={inputPublicKey}
								onChange={(e) => setInputPublicKey(e.target.value)}
							/>
						</WhiteContainer>
					</Dropdown>
					<div>{publicKeyID && `${window.location.origin}/encrypt?uuid=${publicKeyID}`}</div>
					<button
						className="mx-auto mt-[20px] text-[14px] font-bold bg-[#007BEC] px-[16px] py-[10px] rounded-[8px] text-white"
						onClick={sharePublicKey}
					>
						Share your public key
					</button>
				</WhiteContainer>
				<Dropdown
					title="Browser-based generation"
					show={showBrowserBased}
					toggle={() => {
						setShowBrowserBased(!showBrowserBased);
					}}
				>
					<WhiteContainer dropdown>
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
					</WhiteContainer>
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

	/* Style the custom upload button */
	input[type="file"]::file-selector-button {
		width: 0;
		height: 0;
		max-height: 0;
		max-width: 0;
		outline: none;
		border: none;
		background: none;
		padding: 0;
		margin: 0;
	}

	input[type="file"] {
		opacity: 0;
	}
`;
