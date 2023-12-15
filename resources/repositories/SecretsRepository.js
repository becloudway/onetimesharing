const {generateTTL} = require("../helper_functions/timeToLive");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient,
    ScanCommand,
    PutCommand,
    GetCommand,
    DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const { v4: uuidv4 } = require("uuid");

module.exports.SecretsRepository = class {
    static client = new DynamoDBClient({});
    static dynamo = DynamoDBDocumentClient.from(this.client);

    static #tableName = "bolleje-dev-dynamodb"

    static async PostItem(data) {
        const generatedUuid = uuidv4();
        const time_to_live = generateTTL();

        const item = {
            uuid: generatedUuid,
            encryption_type: data.type || "SHE",
            cyphertext: data.cyphertext || "",
            retrievedCount: 1,
            second_half_key: data.type === "SHE" ? data.second_half_key : "",
            ttl: time_to_live
        }

        await this.dynamo.send(new PutCommand({
            TableName: this.#tableName,
            Item: item
        }));

        return generatedUuid;
    }

    static async GetSecret(uuid) {
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