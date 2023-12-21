import { test, expect } from "@playwright/test";

const BASE_URL = "https://8kduwjg2d9.execute-api.eu-west-1.amazonaws.com/prod";
const sheData = {
	cyphertext: "Hallo, mijn naam is Jensen",
	second_half_key: "12345678901234567890123456789012",
};
const e2eData = {
	cyphertext: "Hallo, mijn naam is Jensen",
};

let sheID = "";
let e2eID = "";

test("Adding SHE data should return status code 200 and an ID", async () => {
	const response = await fetch(`${BASE_URL}/addSHE`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(sheData),
	});

	const responseData = await response.json();
	expect(response.status).toBe(200);

	sheID = responseData.id;
});

test("Adding E2E data should return status code 200 and an ID", async () => {
	const response = await fetch(`${BASE_URL}/addE2E`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(e2eData),
	});

	const responseData = await response.json();
	expect(response.status).toBe(200);

	e2eID = responseData.id;
});

test("Adding SHE data with invalid body should return status code 400", async () => {
	const response = await fetch(`${BASE_URL}/addSHE`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			cyphertext: "Hallo, mijn naam is Jensen",
			message: "test",
		}),
	});

	expect(response.status).toBe(400);
});

test("Adding E2E data with invalid body should return status code 400", async () => {
	const response = await fetch(`${BASE_URL}/addE2E`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({}),
	});

	expect(response.status).toBe(400);
});

test("Adding SHE data with invalid cyphertext should return status code 400", async () => {
	const response = await fetch(`${BASE_URL}/addSHE`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			cyphertext: "",
			second_half_key: "1234567890123456789012345678901",
		}),
	});

	expect(response.status).toBe(400);
});

test("Adding E2E data with invalid cyphertext should return status code 400", async () => {
	const response = await fetch(`${BASE_URL}/addE2E`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			cyphertext: "",
		}),
	});

	expect(response.status).toBe(400);
});

test("Adding SHE data with invalid second half key should return status code 400", async () => {
	const response = await fetch(`${BASE_URL}/addSHE`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			cyphertext: "Hallo, mijn naam is Jensen",
			second_half_key: "",
		}),
	});

	expect(response.status).toBe(400);
});

test("Get SHE data", async () => {
	console.log(sheID);
	const response = await fetch(`${BASE_URL}/getSHE/${sheID}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const responseData = await response.json();

	expect(response.status).toBe(200);
	expect(responseData.uuid).toBe(sheID);
	expect(responseData.cyphertext).toBe(sheData.cyphertext);
});

test("Get E2E data", async () => {
	console.log(e2eID);
	const response = await fetch(`${BASE_URL}/getE2E/${e2eID}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const responseData = await response.json();

	expect(response.status).toBe(200);
	expect(responseData.uuid).toBe(e2eID);
	expect(responseData.cyphertext).toBe(e2eData.cyphertext);
});

test("Get SHE data with invalid ID should return status code 404", async () => {
	const response = await fetch(`${BASE_URL}/getSHE/123`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	expect(response.status).toBe(404);
});
