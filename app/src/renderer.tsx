import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import GlobalStyle from "./GlobalStyle";
import KeyGenerator from "./KeyGenerator";
import E2Eencryption from "./E2E-encryption";
import E2Edecryption from "./E2E-decryption";
import GenerateSHE from "./GenerateSHE";

const rootElement = document.getElementById("root");

if (rootElement) {
	const router = createBrowserRouter([
		{
			path: "/",
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
			path: "/generateSHE",
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
					<div>SHE decryption page</div>
				</>
			),
		},
		{
			path: "*",
			element: (
				<>
					<GlobalStyle />
					<h1>404</h1>
				</>
			),
		},
	]);

	const root = createRoot(rootElement);
	root.render(<RouterProvider router={router} />);
} else {
	console.error("Root element not found.");
}
