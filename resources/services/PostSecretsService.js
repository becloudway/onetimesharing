const { buildResponseBody } = require("../helper_functions/buildresponsebody");
const { SecretsRepository } = require("../repositories/SecretsRepository");

module.exports.PostSecretsService = class {
  /**
  *
  * @param {LambdaEvent} lambdaEvent
  */
  static async routeRequest(lambdaEvent, body) {
    if (lambdaEvent.httpMethod === "POST" && lambdaEvent.path === "/addsecret") {

      /*
          Still need to add the verification of the data.

          SHE encrypted secrets => Cyphertext needs to have a max of 20032 bytes,
          anything longer than this amount of bytes should be refused.
          PKI (RSA-2048) => Cyphertext needs to have a max of 256 bytes. Anything longer
          should be refused.
          PKI (RSA-4096) => Cyphertext needs to have a max of 512 bytes. Anything longer
          should be refused.

          The data that is expected by the PostItem function from the SecretsRepository is:
          {
            encryption_type: "SHE" || "PKI",
            cyphertext: string (the encrypted secret),
            retrievedCount: defaults to 1 at this moment in time,
            second_half_key: string (the second half of the encryption key in case of SHE)
            ttl: time-to-live 
          }
      */

      const uuid = await SecretsRepository.PostItem({});
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