const buildResponseBody = (
	status: number,
	body: any,
	headers: { [key: string]: string | boolean | undefined } = {
		"Access-Control-Allow-Credentials": true,
		"Content-Type": "application/json",
	},
	multiValueHeaders?: {
		"Set-Cookie": string[];
	}
) => {
	return {
		statusCode: status,
		headers,
		multiValueHeaders,
		body,
	};
};

export default buildResponseBody;
