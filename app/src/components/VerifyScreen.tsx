import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "../classes/api";
import styled from "styled-components";

type VerifyScreenProps = {
	callback: (password: string, version: number, needsPassword: boolean) => void;
};

const VerifyScreen = ({ callback }: VerifyScreenProps) => {
	const route = useNavigate();
	const [password, setPassword] = useState<string>("");
	const [version, setVersion] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(false);
	const [secretFound, setSecretFound] = useState<boolean>(false);
	const [needsPassword, setNeedsPassword] = useState<boolean>(false);

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		if (searchParams.has("uuid") && searchParams.get("uuid") !== "") {
			getSecret(searchParams.get("uuid") || "");
		} else {
			setLoading(false);
			alert("No uuid found, aborting.");
		}
	}, []);

	const getSecret = (uuid: string) => {
		setLoading(true);
		Api.GetStatus(uuid)
			.then((res) => {
				setSecretFound(res.is_available);
				setNeedsPassword(res.passwordProtected);
				setVersion(res.version);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};

	return (
		<div className="fixed z-40 top-0 right-0 left-0 bottom-0 bg-white overflow-auto flex flex-col">
			{loading && (
				<LoadingText className="mx-auto my-auto text-[26px] font-medium">
					Loading <span>.</span>
					<span>.</span>
					<span>.</span>
				</LoadingText>
			)}
			{!loading && secretFound && (
				<>
					<h1 className="mx-auto mt-auto font-bold text-[36px]">Warning!</h1>
					<div className="mx-auto mt-[10px] max-w-[600px] text-center text-[20px]">
						Are you sure you would like to view this secret? Remember, once you view the secret it will be removed and cannot be viewed
						again.
					</div>
					{needsPassword && (
						<div className="flex items-center justify-center gap-[10px] my-[14px]">
							<div className="text-[16px]">Enter the password (max. 3 tries):</div>
							<input
								type="password"
								placeholder="Enter your password here"
								className="h-[52px] px-[24px] py-[10px]  mt-[6px] rounded-[8px] border-[1px] border-[#007BEC] text-[14px]"
								onChange={(e) => setPassword(e.target.value)}
								value={password}
							/>
						</div>
					)}
					<div className="mx-auto mt-[20px] mb-auto flex gap-[6px]">
						<button
							onClick={() => callback(password, version, needsPassword)}
							className="text-[14px] font-bold bg-[#007BEC] px-[16px] py-[10px] rounded-[8px] text-white"
						>
							Get the secret
						</button>
						<button
							id="copyButton"
							className="bg-slate-200 text-slate-400 px-[16px] py-[10px] text-[14px] font-bold rounded-[8px] focus:outline-none transition duration-300 ease-in-out hover:filter hover:brightness-90"
							onClick={() => {
								route("/");
							}}
						>
							Cancel
						</button>
					</div>
				</>
			)}
			{!loading && !secretFound && (
				<>
					<h1 className="mx-auto mt-auto font-bold text-[36px]">Oops!</h1>
					<div className="mx-auto mt-[10px] max-w-[600px] text-center text-[20px]">
						Looks like this secret is not known to us. Please contact the sender of the secret to generate a new URL for you.
					</div>
					<div className="mx-auto mt-[20px] mb-auto flex gap-[6px]">
						<button
							onClick={() => {
								route("/");
							}}
							className="text-[14px] font-bold bg-[#007BEC] px-[16px] py-[10px] rounded-[8px] text-white"
						>
							Return to the homepage
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default VerifyScreen;

const LoadingText = styled.div`
	@keyframes blink {
		0% {
			opacity: 0.2;
		}
		20% {
			opacity: 1;
		}
		100% {
			opacity: 0.2;
		}
	}

	& span {
		animation-name: blink;
		animation-duration: 1.4s;
		animation-iteration-count: infinite;
		animation-fill-mode: both;
	}

	& span:nth-child(2) {
		animation-delay: 0.2s;
	}

	& span:nth-child(3) {
		animation-delay: 0.4s;
	}
`;
