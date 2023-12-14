const { buildResponseBody } = require("../helper_functions/buildresponsebody");
const { SecretsRepository } = require("../repositories/SecretsRepository");

module.exports.PostSecretsService = class {
  /**
  *
  * @param {LambdaEvent} lambdaEvent
  */
  static async routeRequest(lambdaEvent, body) {
    if (lambdaEvent.httpMethod === "POST" && lambdaEvent.path === "/addsecret") {
      const uuid = await SecretsRepository.PostItem("Dit is een test");
      return this.#handlePostRequest({
        id: uuid
      });
    }

    const error = new Error(
      `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`,
    );
    error.name = "UnimplementedHTTPMethodError";
    throw error;
  }

  static #handlePostRequest(body) {
    return buildResponseBody(200, JSON.stringify(body));
  }
};