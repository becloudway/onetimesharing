const {GetSecretsService} = require("./services/GetSecretsService");
const {buildResponseBody} = require("./helper_functions/buildresponsebody");

/**
 *
 * @param {LambdaEvent} event
 */
module.exports.handler = async (event) => {
  try {
    return await GetSecretsService.routeRequest(event);
  } catch (err) {
    return buildResponseBody(500, err.message || "Unknown server error");
  }
};
