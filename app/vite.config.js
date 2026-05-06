import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
	server: {
		port: 9000,
		proxy: {
			"/api": "https://onetimesharing.sandbox.dev.cloudway.be",
		},
	},
	build: {
		sourcemap: true,
		minify: false,
	},
	plugins: [
		// The plugin below is required for hot reloading React application.
		react(),
		// The plugin below is required for importing SVG files as React components.
		svgr(),
	],
});
