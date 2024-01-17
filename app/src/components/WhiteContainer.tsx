import React from "react";

interface DropdownProps {
	children?: React.ReactNode;
	dropdown?: boolean;
}

const WhiteContainer = ({ children, dropdown = false }: DropdownProps) => {
	return (
		<div
			className={`${!dropdown && "mt-[34px] rounded-[12px]"} py-[22px] px-[36px] h-[calc(100%-75px)] w-full h-auto max-w-[1400px] bg-white`}
		>
			{children}
		</div>
	);
};

export default WhiteContainer;
