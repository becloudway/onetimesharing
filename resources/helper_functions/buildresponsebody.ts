const buildResponseBody = (
	status: number,
	body: any,
	headers = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Headers": "*",
		"Access-Control-Allow-Methods": "*",
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
