const buildResponseBody = (
	status: number,
	body: any,
	headers: { [key: string]: string | boolean | undefined; "Set-Cookie"?: string } = {
		"Access-Control-Allow-Credentials": true,
		"Content-Type": "application/json",
	}
) => {
	return {
		statusCode: status,
		headers,
		body,
	};
};

export default buildResponseBody;
