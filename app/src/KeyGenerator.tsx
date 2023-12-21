import React from "react";
import styled from "styled-components";
import CloudWayLogo from "./assets/logo.png";
import { ReactComponent as WarningIcon } from "./assets/warning-icon.svg";
import InfoBox from "./components/InfoBox";

function App() {
	return (
		<Container className="bg-white w-full h-full">
			<div className="flex flex-col items-center justify-start pt-[34px] w-full h-full bg-[rgba(0,123,236,0.1)]">
				<img className="h-[40px]" src={CloudWayLogo} />
				<div className="mt-[34px] py-[22px] px-[36px] h-[calc(100%-75px)] w-full max-w-[1400px] rounded-t-[12px] bg-white">
					<div className="text-[#007BEC] text-[18px] font-bold">Public key (Give this key to the secret provider)</div>
					<textarea className="w-full h-[240px] px-[14px] py-[10px]  mt-[6px] rounded-[8px] border-[1px] border-[#007BEC] resize-none" />
					<InfoBox
						text="The private key that is shown below is not to be shared under any circumstances and is only shown once. So please keep it safe in a
			password manager for example. This keypair can be reused for sharing secrets indefinitely. Meaning the private key can be reused
			unless it is compromised."
						Icon={WarningIcon}
						type="warning"
					/>
					<div className="text-[#EC0000] text-[18px] font-bold mt-[20px]">Private key</div>
					<textarea className="w-full h-[240px] px-[14px] py-[10px] mt-[6px] rounded-[8px] border-[1px] border-[#EC0000] resize-none" />
					<button
						onClick={() => alert("Dit is een test")}
						className="mt-[20px] text-[14px] font-bold bg-[#007BEC] px-[16px] py-[10px] rounded-[8px] text-white"
					>
						Generate a new PGP keypair
					</button>
				</div>
			</div>
		</Container>
	);
}

export default App;

const Container = styled.div`
	width: 100vw;
	height: 100vh;
`;
