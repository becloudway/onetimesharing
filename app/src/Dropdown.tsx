import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { ReactComponent as ArrowDownIcon } from "./assets/dropdown-arrow.svg";

interface DropdownProps {
	children: any;
	title: string;
	show: boolean;
	toggle: () => void;
}

const Dropdown = ({ children, title, toggle, show }: DropdownProps) => {
	const [delayedProperties, setDelayedProperties] = useState<boolean>(false);

	useEffect(() => {
		setTimeout(() => {
			setDelayedProperties(show);
		}, 200);
	}, [show]);

	return (
		<Wrapper>
			<TitleBox
				onClick={() => {
					if (show === delayedProperties) toggle();
				}}
				show={show}
				delayedProperties={delayedProperties}
			>
				<Title>{title}</Title>
				<StyledArrowDownIcon show={show} />
			</TitleBox>
			<Container show={show} delayedProperties={delayedProperties}>
				{children}
			</Container>
		</Wrapper>
	);
};

export default Dropdown;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;

	width: 100%;
	max-width: 1400px;

	margin-top: 34px;
`;

const TitleBox = styled.div<{ show: boolean; delayedProperties: boolean }>`
	height: 64px;
	width: 100%;

	display: flex;
	align-items: center;
	justify-content: space-between;

	padding-inline: 30px;

	background: white;

	${({ show, delayedProperties }) =>
		show ? "border-radius: 8px 8px 0 0;" : delayedProperties ? "border-radius: 8px 8px 0 0;" : "border-radius: 8px"}
`;

const StyledArrowDownIcon = styled(ArrowDownIcon)<{ show: boolean }>`
	width: 32px;
	height: 32px;

	transform: rotate(${({ show }) => (show ? "180deg" : "0deg")});
	transition: transform 0.2s linear;
`;

const Title = styled.div`
	font-weight: bold;
`;

const Container = styled.div<{ show: boolean; delayedProperties: boolean }>`
	height: auto;

	transform: scaleY(${({ show }) => (show ? "1" : "0")});
	transform-origin: top;
	transition: transform 0.2s linear;

	${({ show, delayedProperties }) => (show ? "height: auto;" : delayedProperties ? "height: auto;" : "height: 0;")}

	overflow: hidden;
`;
