const {buildResponseBody} = require("../helper_functions/buildresponsebody");

module.exports.PostSecretsService = class {
    /**
    *
    * @param {LambdaEvent} lambdaEvent
    */
    static routeRequest(lambdaEvent, body) {
        if (lambdaEvent.httpMethod === "POST" && lambdaEvent.path === "/addsecret") {
            return this.#handlePostRequest(body);
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