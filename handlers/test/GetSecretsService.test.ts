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
      httpMethod: 'POST',
      path: '/secrets',
      pathParameters: { uuid: '123' },
    };

    const response: SecretsStructure = {
      Item: { 
        encryption_type: "SHE",
        cyphertext: "1234",
        second_half_key: "2134",
        version: 2,
        passwordTries: 0,
      },
    };

    (SecretsRepository.GetSecret as jest.Mock).mockResolvedValueOnce(response);
    (SecretsRepository.DeleteSecret as jest.Mock).mockResolvedValueOnce(true);

    await GetSecretsService.routeRequest(lambdaEvent, { Item: { password: "fake_password" } }, '/secrets');

    expect(buildResponseBody).toHaveBeenCalledWith(403, "Wrong password!");
  });

  test('should return the fragment private key only after a correct password', async () => {
    const lambdaEvent: any = {
      httpMethod: 'POST',
      path: '/secrets',
      pathParameters: { uuid: '123' },
    };

    const response: SecretsStructure = {
      Item: {
        encryption_type: "SHE",
        cyphertext: "1234",
        second_half_key: "2134",
        fragment_private_key: "private-key",
        version: 3,
        passwordTries: 0,
      },
    };

    (SecretsRepository.GetSecret as jest.Mock).mockResolvedValueOnce(response);
    (SecretsRepository.CheckPassword as jest.Mock).mockResolvedValueOnce(response);
    (SecretsRepository.DeleteSecret as jest.Mock).mockResolvedValueOnce(true);

    await GetSecretsService.routeRequest(lambdaEvent, { Item: { password: "correct_password" } }, '/secrets');

    expect(buildResponseBody).toHaveBeenCalledWith(200, JSON.stringify(response.Item));
  });

  test('should not return the fragment private key after a wrong password', async () => {
    const lambdaEvent: any = {
      httpMethod: 'POST',
      path: '/secrets',
      pathParameters: { uuid: '123' },
    };

    const response: SecretsStructure = {
      Item: {
        encryption_type: "SHE",
        cyphertext: "1234",
        second_half_key: "2134",
        fragment_private_key: "private-key",
        version: 3,
        passwordTries: 0,
      },
    };

    (SecretsRepository.GetSecret as jest.Mock).mockResolvedValueOnce(response);
    (SecretsRepository.CheckPassword as jest.Mock).mockResolvedValueOnce(false);

    await GetSecretsService.routeRequest(lambdaEvent, { Item: { password: "wrong_password" } }, '/secrets');

    expect(buildResponseBody).toHaveBeenCalledTimes(1);
    expect(buildResponseBody).toHaveBeenCalledWith(403, "Wrong password!");
    expect(SecretsRepository.DeleteSecret).not.toHaveBeenCalled();
  });

  test('should handle unimplemented HTTP method', async () => {
    const lambdaEvent: any = {
      httpMethod: 'GET',
      path: '/secrets',
    };

    await GetSecretsService.routeRequest(lambdaEvent, { Item: { password: "test" } }, '/secrets');

    expect(buildResponseBody).toHaveBeenCalledWith(400, 'Unimplemented HTTP method: GET');
  });
});
