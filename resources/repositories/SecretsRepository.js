const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient,
    ScanCommand,
    PutCommand,
    GetCommand,
    DeleteCommand } = require("@aws-sdk/lib-dynamodb");

module.exports.SecretsRepository = class {
    static client = new DynamoDBClient({});
    static dynamo = DynamoDBDocumentClient.from(this.client);
    
    static async PostItem(tableName, data){
        await this.dynamo.send(new PutCommand({
            TableName: tableName,
            Item: data
        }));
    }
};