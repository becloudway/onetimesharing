import React from "react";

interface IInfoBoxProps {
	Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
	text: string;
	type: "warning" | "info";
}

const InfoBox = ({ Icon, text }: IInfoBoxProps) => {
	return (
		<div className="w-full py-[16px] px-[14px] py-[10px] rounded-[8px] border-[1px] border-[#EC0000] flex items-center text-[#EC0000] bg-[rgba(236,0,0,0.1)] resize-none">
			<Icon className="w-[46px] ml-[6px] mr-[20px]" />
			{text}
		</div>
	);
};

export default InfoBox;
