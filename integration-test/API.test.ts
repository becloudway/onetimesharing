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

test("Add SHE data", async () => {
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

test("Add E2E data", async () => {
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
