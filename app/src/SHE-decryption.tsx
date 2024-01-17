import React, { useEffect, useState } from "react";
import axios from "axios";

import styled from "styled-components";

import AES256 from "./classes/aes-256";

import { ToastContainer } from "react-toastify";
import errorHandling from "./components/errorHandling";
import "react-toastify/dist/ReactToastify.min.css";

import LoadingScreen from "./components/LoadingScreen";
import CopyToClipBoard from "./components/CopyToClipBoard";
import ClickableLogo from "./components/ClickableLogo";
import { Api } from "./classes/api";

function SHEDecryption() {
	const [secret, setSecret] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const getSecret = async (uuid: string, first_half_key: string, iv: string) => {
		if (uuid && uuid.length !== 0 && uuid !== "" && uuid !== undefined) {
			setLoading(true);
			Api.GetSHESecret(uuid)
				.then((response) => {
					decryptSecret(response.data.cyphertext, `${first_half_key}${response.data.second_half_key}`, iv);
					setLoading(false);
				})
				.catch((err) => {
					errorHandling(err);
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

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const hashValue = {
			first_half_key: window.location.hash.split("&")[0].split("=")[1],
			iv: window.location.hash.split("&")[1].split("=")[1],
		};
		const params = {
			uuid: searchParams.get("uuid") || "",
			first_half_key: hashValue.first_half_key || "",
			iv: hashValue.iv || "",
		};

		handleParamsCheck(params)
			.then((check) => {
				if (check) {
					getSecret(params.uuid, params.first_half_key, params.iv);
				}
			})
			.catch((error) => {
				errorHandling("Error checking params: " + error);
			});
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
