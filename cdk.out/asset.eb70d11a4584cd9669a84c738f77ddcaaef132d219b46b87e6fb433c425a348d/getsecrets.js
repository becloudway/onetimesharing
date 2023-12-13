/**
 * @typedef {{statusCode: number, body: string, headers: Record<string, string> }} LambdaResponse
 */
/**
 *
 * @param {number} status
 * @param {Record<string, string>} headers
 * @param {Record<string, unknown>} body
 *
 * @returns {LambdaResponse}
 */
const buildResponseBody = (status, body, headers = {}) => {
  return {
    statusCode: status,
    headers,
    body,
  };
};

/**
 * @typedef {{ httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', path: string }} LambdaEvent
 */

/**
 *
 * @param {LambdaEvent} lambdaEvent
 */
const routeRequest = (lambdaEvent, uuid) => {
  if (lambdaEvent.httpMethod === "GET" && lambdaEvent.path === "/getsecret") {
    return handleGetRequest(uuid);
  }

  return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`);
};

const handleGetRequest = async (uuid) => {
  if (uuid) {
    return buildResponseBody(200, JSON.stringify({
      id: uuid,
      message: "Hello World"
    }));
  }

  return buildResponseBody(400, "No UUID was provided in the URL parameter.");
};

/**
 *
 * @param {LambdaEvent} event
 */
module.exports.handler = async (event) => {
  try {
    return await routeRequest(event, event.queryStringParameters.uuid);
  } catch (err) {
    return buildResponseBody(500, err.message || "Unknown server error");
  }
};
