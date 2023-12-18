import generateTTL from "../helper_functions/timeToLive";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    DeleteCommand
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { SecretsStructure } from "../types/types";

const SecretsRepository = class {
    static client = new DynamoDBClient({});
    static dynamo = DynamoDBDocumentClient.from(this.client);

    static #tableName = "bolleje-dev-dynamodb"

    //This should be of the type that the data is structured in
    static async PostItem(data: SecretsStructure) {
        const generatedUuid = uuidv4();
        const time_to_live = generateTTL();

        const item = {
            uuid: generatedUuid,
            encryption_type: data.Item.encryption_type || "SHE",
            cyphertext: data.Item.cyphertext || "",
            retrievedCount: 1,
            second_half_key: data.Item.encryption_type === "SHE" ? data.Item.second_half_key : "",
            ttl: time_to_live
        }

        await this.dynamo.send(new PutCommand({
            TableName: this.#tableName,
            Item: item
        }));

        return generatedUuid;
    }

    static async GetSecret(uuid: string) {
        const response = await this.dynamo.send(new GetCommand({
            TableName: this.#tableName,
            Key: {
                uuid: uuid,
            }
        }));

        await this.dynamo.send(new DeleteCommand({
            TableName: this.#tableName,
            Key: {
                uuid: uuid,
            }
        }));

        return response;
    }
};

export default SecretsRepository;