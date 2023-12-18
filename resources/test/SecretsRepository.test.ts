import generateTTL from '../helper_functions/timeToLive';
import { v4 as uuidv4 } from 'uuid';
import SecretsRepository from '../repositories/SecretsRepository';
import { SecretsStructure } from '../types/types';

import { mockClient } from "aws-sdk-client-mock";
import {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    DeleteCommand,
  } from '@aws-sdk/lib-dynamodb';

jest.mock('../helper_functions/timeToLive');
const ddbMock = mockClient(DynamoDBDocumentClient);

describe('SecretsRepository', () => {
  afterEach(() => {
    ddbMock.reset();
    jest.resetAllMocks();
  });

  describe('GetSecret', () => {
    test('should get and delete item from DynamoDB', async () => {
      const uuid = 'existing-uuid';

      ddbMock.on(GetCommand).resolves({
        Item: { id: uuid },
      });
      const result = await SecretsRepository.GetSecret(uuid);

      expect(result.Item).toStrictEqual({id: uuid});
    });
  });
});
