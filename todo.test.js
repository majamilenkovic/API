import request from "supertest";

const baseUrl = 'https://l761dniu80.execute-api.us-east-2.amazonaws.com/default/';

describe('GET', () => {

	it('should return status code 200', async () => {

		const response = await request(baseUrl)
			.get('/exercise_api');

		expect(response.statusCode).toBe(200);
	});

});

//It should be POST request
describe('PUT', () => {

	it('should set the new item', async () => {

		const randomNumber = Math.floor((Math.random() * 100 + 1));
		const main_key = "mainKey" + randomNumber;
		const value = "value" + randomNumber

		const response = await request(baseUrl)
			.put("exercise_api")
			.send({
				"main_key": main_key,
				"value": value
			});

		expect(response.statusCode).toBe(201) // status code should be 201 status code
		expect(response.body.value).toEqual(value);
		expect(response.body.main_key).toEqual(main_key);
		expect(response.headers['content-type']).toContain('application/json');
		expect(response.headers['content']).toContain('JSON object');

	});

	it('should throw error when the quota is reached ', async () => {

		const response = await request(baseUrl)
			.put("exercise_api")
			.send({ "main_key": "testdataKey2", "value": "testDataValue" }, { "main_key": "testdataKey3", "value": "testDataValue1" });

		expect(response.body.length).toBeGreaterThan(10);
		expect(response.statusCode).toBe(400);
		expect(response.headers['content-type']).toContain('application/json');
		expect(response.headers['content']).toContain('JSON object');

	});

});


//"Missing Authentication Token
describe('DELETE', () => {

	it('should delete an item', async () => {
		const response = await request(baseUrl)
			.delete('exercise_api/dolor')
		
		expect(response.statusCode).toBe(200) // Received status code 403 Forbidden
	});

});


// This API request is updating an existing entity, it should be PUT/PATCH
describe('POST', () => {

	it('should update an item', async () => {

		const randomNumber = Math.floor((Math.random() * 100 + 1));
		const changedValue = "testDataValue" + randomNumber;

		const response = await request(baseUrl)
			.post('/exercise_api')
			.send({
				"main_key": "testdataKey",
				"value": changedValue
			});

		expect(response.statusCode).toBe(200);
		expect(response.headers['content-type']).toContain('application/json');
		expect(response.body.value).toEqual(changedValue);

	});

	it('should throw 400 if key does not exists', async () => {

		const response = await request(baseUrl)
			.post('/exercise_api')
			.send({
					"main_key": "DoesNotExists"
			});
		expect(response.statusCode).toBe(400);
	});

});
