import React from "react";

import OneTimeSharingLogo from "../assets/loading-icon.png";

interface ILoadingProps {
	show: boolean;
}

const LoadingScreen = ({ show }: ILoadingProps) => {
	return (
		<div className={`z-50 fixed top-0 left-0 right-0 bottom-0 bg-black/75 ${show ? "flex" : "hidden"} items-center justify-center`}>
			<img className="h-[60px] animate-bounce" src={OneTimeSharingLogo} />
		</div>
	);
};

export default LoadingScreen;
