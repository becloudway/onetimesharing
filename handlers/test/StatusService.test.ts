import SecretsRepository from '../repositories/SecretsRepository';
import buildResponseBody from '../helper_functions/buildresponsebody';
import StatusService from '../services/StatusService';

// Mock the SecretsRepository
jest.mock('../repositories/SecretsRepository');

// Mock the buildResponseBody function
jest.mock('../helper_functions/buildresponsebody');

describe('StatusService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should return the password_salt but never the fragment private key', async () => {
    const lambdaEvent: any = {
      httpMethod: 'GET',
      path: '/status',
      pathParameters: { uuid: '123' },
    };

    (SecretsRepository.StatusSecret as jest.Mock).mockResolvedValueOnce({
      Item: {
        encryption_type: "SHE",
        cyphertext: "1234",
        second_half_key: "2134",
        password: "hashed",
        password_salt: "$2b$10$abcdefghijklmnopqrstuv",
        fragment_private_key: "private-key",
        version: 3,
        passwordTries: 0,
      },
    });

    await StatusService.routeRequest(lambdaEvent, '/status');

    const [status, body] = (buildResponseBody as jest.Mock).mock.calls[0];
    expect(status).toBe(200);
    expect(JSON.parse(body)).toStrictEqual({
      is_available: true,
      passwordProtected: true,
      version: 3,
      password_salt: "$2b$10$abcdefghijklmnopqrstuv",
    });
  });
});
