const {buildResponseBody} = require("../helper_functions/buildreponsebody");

module.exports.GetSecretsService = class {
    /**
    *
    * @param {LambdaEvent} lambdaEvent
    */
    static routeRequest(lambdaEvent) {
        if (lambdaEvent.httpMethod === "GET" && lambdaEvent.path === "/getsecret") {
            return this.#handleGetRequest();
        }

        if (lambdaEvent.httpMethod === "GET" && lambdaEvent.path.includes('/getsecret')) {
            const uuid = lambdaEvent.pathParameters && lambdaEvent.pathParameters.uuid;
            return this.#handleGetRequest(uuid);
        }

        return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`);
    }

    static #handleGetRequest(uuid) {
        if (uuid) {
            return buildResponseBody(200, JSON.stringify({
                id: uuid,
                message: "Hello World"
            }));

        } else {
            return buildResponseBody(200, JSON.stringify({
                message: "Hello World"
            }));
        }
    }
};