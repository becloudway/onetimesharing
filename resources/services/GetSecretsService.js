const { buildResponseBody } = require("../helper_functions/buildresponsebody");
const { SecretsRepository } = require("../repositories/SecretsRepository");

module.exports.GetSecretsService = class {
    /**
    *
    * @param {LambdaEvent} lambdaEvent
    */
    static async routeRequest(lambdaEvent, route) {
        if (lambdaEvent.httpMethod === "GET" && lambdaEvent.path.includes(route)) {
            const uuid = lambdaEvent.pathParameters && lambdaEvent.pathParameters.uuid;
            const response = await SecretsRepository.GetSecret(uuid);

            if (response.Item === undefined) {
                return buildResponseBody(404, `No data was found for the uuid: ${uuid}`);
            } else {
                return this.#handleGetRequest(response);
            }
        }

        return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`);
    }

    static #handleGetRequest(response) {
        return buildResponseBody(200, JSON.stringify(response.Item));
    }
};