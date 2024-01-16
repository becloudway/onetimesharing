import React from "react";

interface DropdownProps {
	children?: React.ReactNode;
}

const WhiteContainer = ({ children }: DropdownProps) => {
	return (
		<div className="mt-[34px] py-[22px] px-[36px] h-[calc(100%-75px)] w-full h-auto max-w-[1400px] rounded-[12px] bg-white">{children}</div>
	);
};

export default WhiteContainer;
