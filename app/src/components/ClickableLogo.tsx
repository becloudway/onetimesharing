import React from "react";

import OneTimeSharingLogo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const ClickableLogo = () => {
	const navigate = useNavigate();

	return (
		<>
			<img className="h-[40px] cursor-pointer" src={OneTimeSharingLogo} onClick={() => navigate("/")} />
		</>
	);
};

export default ClickableLogo;
