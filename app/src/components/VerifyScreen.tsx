import React from "react";

type VerifyScreenProps = {
	callback: () => void;
};

const VerifyScreen = ({ callback }: VerifyScreenProps) => {
	return (
		<div className="fixed z-50 top-0 right-0 left-0 bottom-0 bg-red-500">
			<button onClick={callback}>Close</button>
		</div>
	);
};

export default VerifyScreen;
