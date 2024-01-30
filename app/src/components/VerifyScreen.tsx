import React from "react";
import { useNavigate } from "react-router-dom";

type VerifyScreenProps = {
	callback: () => void;
};

const VerifyScreen = ({ callback }: VerifyScreenProps) => {
	const route = useNavigate();

	return (
		<div className="fixed z-50 top-0 right-0 left-0 bottom-0 bg-white overflow-auto flex flex-col">
			<h1 className="mx-auto mt-auto font-bold text-[36px]">Warning!</h1>
			<div className="mx-auto mt-[10px] max-w-[600px] text-center text-[20px]">
				Are you sure you would like to view this secret? Remember, once you view the secret it will be removed and cannot be viewed again.
			</div>
			<div className="mx-auto mt-[20px] mb-auto flex gap-[6px]">
				<button onClick={callback} className="text-[14px] font-bold bg-[#007BEC] px-[16px] py-[10px] rounded-[8px] text-white">
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
		</div>
	);
};

export default VerifyScreen;
