import buildResponseBody from "../helper_functions/buildresponsebody";
import SecretsRepository from "../repositories/SecretsRepository";

import { APIGatewayProxyEvent } from "aws-lambda";
import { SecretsStructure } from "../types/types";

const PostSecretsService = class {
  static async routeRequest(
    lambdaEvent: APIGatewayProxyEvent,
    data: SecretsStructure,
    route: string
  ) {
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
            encryption_type: "SHE" || "E2E",
            cyphertext: string (the encrypted secret),
            retrievedCount: defaults to 1 at this moment in time,
            second_half_key: string (the second half of the encryption key in case of SHE)
            ttl: time-to-live 
          }
      */

      try {
        this.#verifyData(data as SecretsStructure);
      } catch (err: any) {
        return buildResponseBody(400, err.message || "Unknown server error");
      }

      const uuid = await SecretsRepository.PostItem(data as SecretsStructure);
      return this.#handlePostRequest({
        id: uuid,
      });
    }

    return buildResponseBody(
      400,
      `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`
    );
  }

  static #verifyData(data: SecretsStructure) {
    const { Item } = data;

    if (Item.encryption_type === "SHE") {
      if (Item.cyphertext.length > 20032) {
        throw new Error(
          "Provided data exceeds the maximum length allowed for SHE encrypted secrets."
        );
      }

      const secondHalfKey = Item.second_half_key;

      if (secondHalfKey !== undefined && secondHalfKey.length !== 32) {
        throw secondHalfKey === undefined ? new Error(
          "No value for the second_half_key field."
        ) : new Error("The second half of the encryption key must be 32 characters long.");
      }
    } else if (Item.encryption_type === "E2E" && Item.cyphertext.length > 512) {
      throw new Error(
        "Provided data exceeds the maximum length allowed for E2E encrypted secrets."
      );
    }
  }

  static #handlePostRequest(body: { id: string }) {
    return buildResponseBody(200, JSON.stringify(body));
  }
};

export default PostSecretsService;
