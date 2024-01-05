import React from "react";
import { useState } from "react";

interface ICopyToClipBoardProps {
	text: string;
}

const CopyToClipBoard = ({ text }: ICopyToClipBoardProps) => {
	const [isClicked, setIsClicked] = useState<boolean>(false);

	const copyText = () => {
		setIsClicked(true);
		navigator.clipboard.writeText(text);

		setTimeout(() => {
			setIsClicked(false);
		}, 1500);
	};

	return (
		<button
			onClick={copyText}
			id="copyButton"
			className={`absolute right-[6px] top-[12px] ${isClicked ? "bg-green-500" : "bg-slate-200"} ${
				isClicked ? "text-white" : "text-slate-400"
			} px-4 py-2 rounded-[8px] focus:outline-none transition duration-300 ease-in-out hover:filter hover:brightness-90`}
		>
			{isClicked ? "Copied!" : "Copy"}
		</button>
	);
};

export default CopyToClipBoard;
