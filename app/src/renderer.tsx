import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import GlobalStyle from "./GlobalStyle";
import KeyGenerator from "./KeyGenerator";
import E2Eencryption from "./E2E-encryption";
import E2Edecryption from "./E2E-decryption";
import GenerateSHE from "./SHE-encryption";
import SHEDecryption from "./SHE-decryption";
import Navigation from "./Navigation";
import Callback from "./Callback";
import ErrorPage from "./components/ErrorPage";

const rootElement = document.getElementById("root");

if (rootElement) {
	const router = createBrowserRouter([
		{
			path: "/",
			element: (
				<>
					<GlobalStyle />
					<Navigation />
				</>
			),
		},
		{
			path: "/callback",
			element: (
				<>
					<GlobalStyle />
					<Callback />
				</>
			),
		},
		{
			path: "/keygenerator",
			element: (
				<>
					<GlobalStyle />
					<KeyGenerator />
				</>
			),
		},
		{
			path: "/encrypt",
			element: (
				<>
					<GlobalStyle />
					<E2Eencryption />
				</>
			),
		},
		{
			path: "/decrypt",
			element: (
				<>
					<GlobalStyle />
					<E2Edecryption />
				</>
			),
		},
		{
			path: "/encryptSHE",
			element: (
				<>
					<GlobalStyle />
					<GenerateSHE />
				</>
			),
		},
		{
			path: "/decryptSHE",
			element: (
				<>
					<GlobalStyle />
					<SHEDecryption />
				</>
			),
		},
		{
			path: "*",
			element: (
				<>
					<GlobalStyle />
					<ErrorPage />
				</>
			),
		},
	]);

	const root = createRoot(rootElement);
	root.render(<RouterProvider router={router} />);
} else {
	console.error("Root element not found.");
}
