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
 * @typedef {{ message: string }} BodyType
 */

/**
 *
 * @param {LambdaEvent} lambdaEvent
 * @param {BodyType} body
 */
const routeRequest = (lambdaEvent, body) => {
  if (lambdaEvent.httpMethod === "POST" && lambdaEvent.path === "/post") {
    return handlePostRequest(body);
  }

  const error = new Error(
    `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`,
  );
  error.name = "UnimplementedHTTPMethodError";
  throw error;
};

/**
 * @param {BodyType} body
 */
const handlePostRequest = async (body) => {
  return buildResponseBody(200, JSON.stringify(body));
};

/**
 *
 * @param {LambdaEvent} event
 */
module.exports.handler = async (event) => {
  try {
    return await routeRequest(event, JSON.parse(event.body));
  } catch (err) {
    console.error(err);

    if (err.name === "MissingBucketName") {
      return buildResponseBody(400, err.message);
    }

    if (err.name === "EmptyBucketError") {
      return buildResponseBody(204, []);
    }

    if (err.name === "UnimplementedHTTPMethodError") {
      return buildResponseBody(400, err.message);
    }

    return buildResponseBody(500, err.message || "Unknown server error");
  }
};
