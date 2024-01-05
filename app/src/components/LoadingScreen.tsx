import React from "react";

import CloudWayLogo from "../assets/loading-icon.png";

const LoadingScreen = () => {
	return (
		<div className="fixed top-0 left-0 right-0 bottom-0 bg-black/75 flex items-center justify-center">
			<img className="h-[60px] animate-bounce" src={CloudWayLogo} />
		</div>
	);
};

export default LoadingScreen;
