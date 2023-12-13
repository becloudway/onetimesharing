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
module.exports.buildResponseBody = (status, body, headers = {}) => {
    return {
        statusCode: status,
        headers,
        body,
    };
};