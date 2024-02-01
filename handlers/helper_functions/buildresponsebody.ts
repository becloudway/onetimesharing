const buildResponseBody = (
	status: number,
	body: any,
	headers = {
		"Access-Control-Allow-Origin": "http://localhost:9000",
		"Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Origin, Authorization",
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
