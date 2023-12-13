const {PostSecretsService} = require("./services/PostSecretsService");
const {buildResponseBody} = require("./helper_functions/buildResponseBody");

/**
 *
 * @param {LambdaEvent} event
 */
module.exports.handler = async (event) => {
  try {
    return PostSecretsService.routeRequest(event, JSON.parse(event.body));
  } catch (err) {
    return buildResponseBody(500, err.message || "Unknown server error");
  }
};
