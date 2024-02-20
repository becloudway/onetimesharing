import { APIGatewayProxyEvent } from 'aws-lambda';
import SecretsRepository from '../repositories/SecretsRepository';
import buildResponseBody from '../helper_functions/buildresponsebody';
import GetSecretsService from '../services/GetSecretsService';
import { SecretsStructure } from '../types/types';

// Mock the SecretsRepository
jest.mock('../repositories/SecretsRepository');

// Mock the buildResponseBody function
jest.mock('../helper_functions/buildresponsebody');

describe('GetSecretsService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should handle successful GET request', async () => {
    const lambdaEvent: any = {
      httpMethod: 'GET',
      path: '/secrets',
      pathParameters: { uuid: '123' },
    };

    const response: SecretsStructure = {
      Item: { 
        encryption_type: "SHE",
        cyphertext: "1234",
        second_half_key: "2134"
      },
    };

    (SecretsRepository.GetSecret as jest.Mock).mockResolvedValueOnce(response);
    (SecretsRepository.DeleteSecret as jest.Mock).mockResolvedValueOnce(true);

    await GetSecretsService.routeRequest(lambdaEvent, '/secrets');

    expect(buildResponseBody).toHaveBeenCalledWith(200, JSON.stringify(response.Item));
  });

  test('should handle unimplemented HTTP method', async () => {
    const lambdaEvent: any = {
      httpMethod: 'POST',
      path: '/secrets',
    };

    await GetSecretsService.routeRequest(lambdaEvent, '/secrets');

    expect(buildResponseBody).toHaveBeenCalledWith(400, 'Unimplemented HTTP method: POST');
  });
});
