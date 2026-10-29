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
        password_salt: "$2b$10$abcdefghijklmnopqrstuv",
        version: 2,
        passwordTries: 0,
      },
    };

    const uuid = 'generated-uuid';
    (SecretsRepository.PostItem as jest.Mock).mockResolvedValueOnce(uuid);

    await PostSecretsService.routeRequest(lambdaEvent, data, '/addSHE');

    expect(SecretsRepository.PostItem).toHaveBeenCalledWith(data, expect.any(String));
    const [status, body] = (buildResponseBody as jest.Mock).mock.calls[0];
    expect(status).toBe(200);
    expect(JSON.parse(body).id).toBe(uuid);
    expect(typeof JSON.parse(body).public_key).toBe("string");
  });

  test('should reject SHE POST with password but without password_salt', async () => {
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
        passwordTries: 0,
      },
    };

    await PostSecretsService.routeRequest(lambdaEvent, data, '/addSHE');

    expect(SecretsRepository.PostItem).not.toHaveBeenCalled();
    expect(buildResponseBody).toHaveBeenCalledWith(400, "Missing password_salt field.");
  });

  test('should reject SHE POST with a malformed password_salt', async () => {
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
        password_salt: "not-a-salt",
        passwordTries: 0,
      },
    };

    await PostSecretsService.routeRequest(lambdaEvent, data, '/addSHE');

    expect(SecretsRepository.PostItem).not.toHaveBeenCalled();
    expect(buildResponseBody).toHaveBeenCalledWith(400, "The password_salt field must be a valid bcrypt salt.");
  });

  test('should accept E2E POST without password or public_key_uuid (pasted PGP key)', async () => {
    const lambdaEvent: any = {
      httpMethod: 'POST',
      path: '/addE2E',
    };

    const data: SecretsStructure = {
      Item: {
        encryption_type: "E2E",
        cyphertext: "1234",
        passwordTries: 0,
        version: 2,
      },
    };

    const uuid = 'generated-uuid';
    (SecretsRepository.PostItem as jest.Mock).mockResolvedValueOnce(uuid);

    await PostSecretsService.routeRequest(lambdaEvent, data, '/addE2E');

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
