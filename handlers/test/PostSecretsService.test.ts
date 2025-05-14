import { APIGatewayProxyEvent } from 'aws-lambda';
import buildResponseBody from '../helper_functions/buildresponsebody';
import SecretsRepository from '../repositories/SecretsRepository';
import PostSecretsService from '../services/PostSecretsService';
import { SecretsStructure } from '../types/types';

// Mock the SecretsRepository
jest.mock('../repositories/SecretsRepository');

// Mock the buildResponseBody function
jest.mock('../helper_functions/buildresponsebody');

describe('PostSecretsService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should handle successful POST request', async () => {
    const lambdaEvent: any = {
      httpMethod: 'POST',
      path: '/addSHE',
    };

    const data: SecretsStructure = {
      Item: {
        encryption_type: "SHE",
        cyphertext: "1234",
        second_half_key: "12345678901234567890123456789012",
        password: "test",
        version: 2,
        passwordTries: 0,
      },
    };

    const uuid = 'generated-uuid';
    (SecretsRepository.PostItem as jest.Mock).mockResolvedValueOnce(uuid);

    await PostSecretsService.routeRequest(lambdaEvent, data, '/addSHE');

    expect(SecretsRepository.PostItem).toHaveBeenCalledWith(data);
    expect(buildResponseBody).toHaveBeenCalledWith(200, JSON.stringify({ id: uuid }));
  });

  test('should handle unimplemented HTTP method', async () => {
    const lambdaEvent: any = {
      httpMethod: 'GET',
      path: '/secrets',
    };

    const data: SecretsStructure = {
      Item: {
        encryption_type: "SHE",
        cyphertext: "1234",
        second_half_key: "2134",
        passwordTries: 0,
        version: 2,
      },
    };

    await PostSecretsService.routeRequest(lambdaEvent, data, '/secrets');

    expect(buildResponseBody).toHaveBeenCalledWith(400, 'Unimplemented HTTP method: GET');
  });
});
