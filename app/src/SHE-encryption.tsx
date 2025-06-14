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
import CloudwayLogo from "./assets/cloudway-logo.png";
import BcryptJS from "./classes/bcrypt";
import PasswordEncryption from "./classes/password_encryption";
import PasswordRules from "./classes/password-rules";
import ShowHidePassword from "./components/ShowHidePassword";

function SHEEncryption() {
	const [secret, setSecret] = useState<string>("");
	const [secretURL, setSecretURL] = useState<{ uuid: string; first_half_key: string; iv: string }>({
		uuid: "",
		first_half_key: "",
		iv: "",
	});
	const [encryptedURLPart, setEncryptedURLPart] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [password, setPassword] = useState<string>("");
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const postSecret = async (encryptedSecret: string, first_half_key: string, second_half_key: string, iv: string) => {
		setLoading(true);
		const hashedPassword = await BcryptJS.encryptPassword(password || "", first_half_key);
		Api.PostSHESecret(
			password
				? {
						cyphertext: encryptedSecret,
						second_half_key: second_half_key,
						password: hashedPassword,
				  }
				: {
						cyphertext: encryptedSecret,
						second_half_key: second_half_key,
				  }
		)
			.then((response) => {
				setSecretURL({
					uuid: response,
					first_half_key: first_half_key,
					iv: iv,
				});

				const generatedEncryptedURLPart = PasswordEncryption.encrypt(`first_half_key=${first_half_key}&iv=${iv}`, password);
				setEncryptedURLPart(generatedEncryptedURLPart);

				setLoading(false);
			})
			.catch((err) => {
				errorHandling(err);
				setLoading(false);
			});
	};

	const encryptSecret = async () => {
		if (!secret) {
			errorHandling("Please enter a secret");
			return;
		}

		if (password) {
			const passwordRulesResponse = PasswordRules.checkPasswordRules(password);
			if (!passwordRulesResponse.valid) {
				errorHandling(passwordRulesResponse.message);
				return;
			}
		}

		await AES256.encryptSecret(secret).then((res) => {
			postSecret(res.encrypted, res.key.slice(0, 32), res.key.slice(32, 64), res.iv);
		});
	};

	const togglePassword = () => {
		setShowPassword(!showPassword);
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
				<div className="mt-[34px] py-[22px] px-[36px] h-[calc(100%-75px)] w-full h-auto max-w-[1400px] rounded-[12px] bg-white">
					<div className="text-[#007BEC] text-[18px] font-bold">Enter the secret</div>
					<textarea
						placeholder="Enter your secret"
						className="w-full h-[240px] px-[14px] py-[10px]  mt-[6px] rounded-[8px] border-[1px] border-[#007BEC] resize-none"
						value={secret}
						onChange={(e) => setSecret(e.target.value)}
					></textarea>
					<div className="text-[#007BEC] text-[18px] font-bold mt-[12px]">Add a password to your secret</div>
					{
						password !== "" && <ul style={{listStyle: "disc"}} className={`mx-auto ml-[30px] font-bold text-[12px] opacity-60 ${PasswordRules.checkPasswordRules(password).valid ? "text-green-500" : "text-black"}`}><li>Passwords must at least contain 8 characters.</li></ul>
					}
					<div className="relative">
						<ShowHidePassword onClick={togglePassword} show={showPassword}/>
						<input
							type={showPassword ? "text" : "password"}
							placeholder="Enter your password here"
							className="w-full h-[52px] px-[14px] py-[10px]  mt-[6px] rounded-[8px] border-[1px] border-[#007BEC]"
							onChange={(e) => setPassword(e.target.value)}
							value={password}
						/>
					</div>
					<button
						onClick={encryptSecret}
						className="mx-auto mt-[20px] text-[14px] font-bold bg-[#007BEC] px-[16px] py-[10px] rounded-[8px] text-white"
					>
						Create a secret
					</button>
					<div className="text-[#007BEC] text-[18px] font-bold mt-[12px]">Send the following link to the recipient</div>
					<div className="relative">
						<CopyToClipBoard text={`${window.location.origin}/decryptSHE?uuid=${secretURL.uuid}#${encryptedURLPart}`} />
						<input
							readOnly
							type="text"
							placeholder="Your secret link will be generated here"
							className="text-center w-full h-[52px] px-[14px] py-[10px]  mt-[6px] rounded-[8px] border-[1px] border-[#007BEC] resize-none"
							value={secretURL.uuid && `${window.location.origin}/decryptSHE?uuid=${secretURL.uuid}#${encryptedURLPart}`}
						/>
					</div>
				</div>
				<a className="flex items-center justify-center gap-[10px] mt-[20px]" href="https://cloudway.be/">
					Powered by <img className="h-5" src={CloudwayLogo} />
				</a>
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
