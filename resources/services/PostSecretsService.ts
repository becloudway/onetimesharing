import buildResponseBody from "../helper_functions/buildresponsebody";
import SecretsRepository from "../repositories/SecretsRepository";

import { APIGatewayProxyEvent } from 'aws-lambda';
import { SecretsStructure } from "../types/types";

const PostSecretsService = class {
  static async routeRequest(lambdaEvent: APIGatewayProxyEvent, data: SecretsStructure, route: string) {
    if (lambdaEvent.httpMethod === "POST" && lambdaEvent.path === route) {
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

      const uuid = await SecretsRepository.PostItem(data as SecretsStructure);
      return this.#handlePostRequest({
        id: uuid
      });
    }

    return buildResponseBody(400, `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`);
  }

  static #handlePostRequest(body: { id: string }) {
    return buildResponseBody(200, JSON.stringify(body));
  }
};

export default PostSecretsService;