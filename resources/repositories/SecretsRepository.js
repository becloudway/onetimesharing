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

        const item = {
            hashkey: generatedUuid,
            encryption_type: data.type || "SHE",
            cyphertext: data
        }

        await this.dynamo.send(new PutCommand({
            TableName: this.#tableName,
            Item: item
        }));

        return generatedUuid;
    }
};