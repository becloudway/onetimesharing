import variables from "../config.json";

const getAPIURL = () => {
	const { ENVIRONMENT, DEV_API_URL, PROD_API_URL } = variables;

	if (ENVIRONMENT === "dev") {
		return DEV_API_URL;
	} else if (ENVIRONMENT === "prod") {
		return PROD_API_URL;
	} else {
		throw new Error("Invalid environment");
	}
};

export default getAPIURL;
