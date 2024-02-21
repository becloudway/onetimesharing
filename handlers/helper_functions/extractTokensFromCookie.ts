const extractTokensFromCookie = (cookie: string, tokenName: string) => {
    const tokenRegex = new RegExp(`${tokenName}=([^;]+)`);
    const tokenMatch = cookie.match(tokenRegex);
    return tokenMatch ? tokenMatch[1] : null;
};

export { extractTokensFromCookie };
