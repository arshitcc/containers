import { beforeAll, beforeEach, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../index.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// To hold the in-memory MongoDB server instance.
let mongodb;

// This function sets up the entire test environment before any tests run.
beforeAll(async () => {
  // Disconnect from any existing mongoose connection.
  await mongoose.disconnect();

  // Create and start a new in-memory MongoDB server instance.
  mongodb = await MongoMemoryServer.create();

  // Get the URI of the temporary database.
  const mongoUri = mongodb.getUri();
  await mongoose.connect(mongoUri);
});

// To clean-up for every test case from database
beforeEach(async () => {
  // Get all collections from the database.
  const collections = await mongoose.connection?.db?.collections();

  if (!collections) return;
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

// To clean-up the test environment after all tests have run.
afterAll(async () => {
  // Stop the in-memory MongoDB server if it's running.
  if (mongodb) {
    await mongodb.stop();
  }
  // Close the mongoose connection to clean up resources.
  await mongoose.connection.close();
});

// 'describe' groups related tests into a "test suite".
describe("Server Check and set password", () => {
  // 'it' defines an individual test case.

  it("should welcome the big-name users", async () => {
    const endpoint = "/";
    const name = "Meher Kaur";

    const response = await request(app).post(endpoint).send({name});

    // Assertions: Check if the response from the server is correct.
    expect(response.statusCode).toBe(201);
    expect(response.body.bigName).toBe(true);
  });

  it("should check strength of given password", async () => {
    const endpoint = "/set-password";

    const password = "helloworld";
    const response = await request(app).post(endpoint).send({password});

    // Assertions
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe(`Strong`);
  });
});
