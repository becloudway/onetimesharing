class Cookies {
	static getCookie(cookieName: string): string | undefined {
		const name = cookieName + "=";
		const decodedCookie = decodeURIComponent(document.cookie);
		const cookieArray = decodedCookie.split(";");

		for (let i = 0; i < cookieArray.length; i++) {
			let cookie = cookieArray[i].trim();
			if (cookie.indexOf(name) === 0) {
				return cookie.substring(name.length, cookie.length);
			}
		}
		return undefined;
	}

	static deleteCookies() {
		document.cookie = `id_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/api;`;
		document.cookie = `access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/api;`;
		document.cookie = `refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/api;`;
	}
}

export { Cookies };
