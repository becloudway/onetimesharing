const buildResponseBody = (status: number, body: any, headers = {}) => {
    return {
        statusCode: status,
        headers,
        body,
    };
};

export default buildResponseBody;