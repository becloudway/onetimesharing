import React from "react";
import { useState } from "react";

interface ICopyToClipBoardProps {
	text: string;
}

const DownloadFile = ({ text }: ICopyToClipBoardProps) => {
	const [isClicked, setIsClicked] = useState<boolean>(false);

	const downloadFile = () => {
		const file = new File([text], "secret.gpg", {
			type: "text/plain",
		});

		const link = document.createElement("a");
		link.href = window.URL.createObjectURL(file);
		link.download = file.name;

		document.body.appendChild(link);
		link.click();

		document.body.removeChild(link);
		window.URL.revokeObjectURL(link.href);
	};

	return (
		<button
			onClick={downloadFile}
			id="downloadButton"
			className={`absolute right-[80px] top-[12px] ${isClicked ? "bg-green-500" : "bg-slate-200"} ${
				isClicked ? "text-white" : "text-slate-400"
			} px-4 py-2 rounded-[8px] focus:outline-none transition duration-300 ease-in-out hover:filter hover:brightness-90`}
		>
			{isClicked ? "Downloaded!" : "Download"}
		</button>
	);
};

export default DownloadFile;
