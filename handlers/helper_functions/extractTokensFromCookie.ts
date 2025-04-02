const extractTokensFromCookie = (cookie: string) => {
    const tokenMatch = cookie.match(/auth_token=([^;]+)/);
    return tokenMatch ? tokenMatch[1] : null;
};

export { extractTokensFromCookie };
