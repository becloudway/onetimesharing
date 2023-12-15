const {buildResponseBody} = require("../helper_functions/buildresponsebody");
const { SecretsRepository } = require("../repositories/SecretsRepository");

module.exports.GetSecretsService = class {
    /**
    *
    * @param {LambdaEvent} lambdaEvent
    */
    static async routeRequest(lambdaEvent) {
        if (lambdaEvent.httpMethod === "GET" && lambdaEvent.path.includes('/getsecret')) {
            const uuid = lambdaEvent.pathParameters && lambdaEvent.pathParameters.uuid;
            const response = await SecretsRepository.GetSecret(uuid);
            return this.#handleGetRequest(response);
        }

        return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`);
    }

    static #handleGetRequest(response) {
            return buildResponseBody(200, JSON.stringify(response.Item));
    }
};