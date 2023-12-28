import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import react from "@vitejs/plugin-react";

export default defineConfig({
	server: {
		port: 9000,
	},
	plugins: [
		// The plugin below is required for hot reloading React application.
		react(),
		// The plugin below is required for typescript support in Vite.
		require("vite-plugin-ts")({
			tsconfig: "tsconfig.json",
		}),
		// The plugin below is required for importing SVG files as React components.
		require("vite-plugin-svgr")(),
	],
});
