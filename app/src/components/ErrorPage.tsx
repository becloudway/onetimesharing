import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
	const route = useNavigate();

	return (
		<div className="fixed z-50 top-0 right-0 left-0 bottom-0 bg-white overflow-auto flex flex-col">
			<h1 className="mx-auto mt-auto font-bold text-[36px]">Oops!</h1>
			<div className="mx-auto mt-[10px] max-w-[600px] text-center text-[20px]">
				Looks like you took a wrong turn on the secret path. This route seems to be a secret even to us!
			</div>
			<div className="mx-auto mt-[20px] mb-auto flex gap-[6px]">
				<button onClick={() => route("/")} className="text-[14px] font-bold bg-[#007BEC] px-[16px] py-[10px] rounded-[8px] text-white">
					Return to home
				</button>
			</div>
		</div>
	);
};

export default ErrorPage;
