import React, { useState } from "react";

import styled from "styled-components";

import AES256 from "./classes/aes-256";

import { ToastContainer } from "react-toastify";
import errorHandling from "./components/errorHandling";
import "react-toastify/dist/ReactToastify.min.css";

import LoadingScreen from "./components/LoadingScreen";
import CopyToClipBoard from "./components/CopyToClipBoard";
import ClickableLogo from "./components/ClickableLogo";
import { Api } from "./classes/api";
import VerifyScreen from "./components/VerifyScreen";
import CloudwayLogo from "./assets/cloudway-logo.png";
import BcryptJS from "./classes/bcrypt";
import FragmentEncryption from "./classes/fragment-encryption";

function SHEDecryption() {
	const [secret, setSecret] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [verify, setVerify] = useState<boolean>(true);

	const getSecret = async (uuid: string, first_half_key: string, iv: string, password: string) => {
		if (uuid && uuid.length !== 0 && uuid !== "" && uuid !== undefined) {
			setLoading(true);
			Api.GetSHESecret(uuid, password)
				.then((response) => {
					decryptSecret(response.data.cyphertext, `${first_half_key}${response.data.second_half_key}`, iv);
					setLoading(false);
				})
				.catch((err) => {
					errorHandling(err);
					setVerify(true);
					setLoading(false);
				});
		}
	};

	// Version 3: the fragment is encrypted, its private key is returned together with the secret after a correct password
	const getEncryptedFragmentSecret = async (uuid: string, encryptedFragment: string, password: string) => {
		if (uuid && uuid.length !== 0 && uuid !== "" && uuid !== undefined) {
			setLoading(true);
			Api.GetSHESecret(uuid, password)
				.then(async (response) => {
					try {
						const decryptedFragment = await FragmentEncryption.decrypt(encryptedFragment, response.data.fragment_private_key || "");
						const fragmentParams = new URLSearchParams(decryptedFragment);
						decryptSecret(response.data.cyphertext, `${fragmentParams.get("first_half_key")}${response.data.second_half_key}`, fragmentParams.get("iv") || "");
					} catch {
						errorHandling("The link appears to be corrupted, the secret could not be decrypted.");
					}
					setLoading(false);
				})
				.catch((err) => {
					errorHandling(err);
					setVerify(true);
					setLoading(false);
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
				errorHandling(err.message);
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

	const fetchSecret = async (password: string, version: number, needsPassword: boolean, passwordSalt: string) => {
		const searchParams = new URLSearchParams(window.location.search);

		if (version >= 3) {
			const uuid = searchParams.get("uuid") || "";
			const encryptedFragment = new URLSearchParams(window.location.hash.slice(1)).get("k") || "";

			if (!uuid || !encryptedFragment) {
				errorHandling("Error checking params: " + (!uuid ? "No uuid provided" : "No encrypted key provided"));
				return;
			}

			const hashedPassword = needsPassword ? await BcryptJS.encryptPasswordWithSalt(password, passwordSalt) : "";
			getEncryptedFragmentSecret(uuid, encryptedFragment, hashedPassword);
			return;
		}

		const decryptedURLPart = window.location.hash.slice(1);
		const hashValue = {
			first_half_key: decryptedURLPart.split("&")[0].split("=")[1],
			iv: decryptedURLPart.split("&")[1].split("=")[1],
		};

		console.log(hashValue.first_half_key);
		console.log(password);

		const params = {
			uuid: searchParams.get("uuid") || "",
			first_half_key: hashValue.first_half_key || "",
			iv: hashValue.iv || "",
		};

		const hashedPassword = needsPassword ? await BcryptJS.encryptPassword(password, hashValue.first_half_key) : "";

		handleParamsCheck(params)
			.then((check) => {
				if (check) {
					getSecret(params.uuid, params.first_half_key, params.iv, version === 1 ? password : hashedPassword);
				}
			})
			.catch((error) => {
				errorHandling("Error checking params: " + error);
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
			{verify && (
				<VerifyScreen
					callback={(password: string, version: number, needsPassword: boolean, passwordSalt: string) => {
						setVerify(false);
						fetchSecret(password, version, needsPassword, passwordSalt);
					}}
				/>
			)}
			<div className="flex flex-col items-center justify-start pt-[34px] px-[12px] w-full h-full overflow-auto pb-[20px] bg-[rgba(0,123,236,0.1)]">
				<ClickableLogo />
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
				<a className="flex items-center justify-center gap-[10px] mt-[20px]" href="https://cloudway.be/">Powered by <img className="h-5" src={CloudwayLogo} /></a>
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
