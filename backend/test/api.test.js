const { test, describe } = require("node:test");
const assert = require("node:assert");

const BASE_URL = process.env.API_URL || "http://localhost:3000";

describe("CareerTrack API Test Suite", () => {
  let createdId = null;

  test("1. GET / - Health Check Endpoint", async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200, "Should return HTTP 200");
    const data = await res.json();
    assert.strictEqual(data.message, "Job Application Tracker API is running!");
  });

  test("2. GET /api/applications/stats - Aggregation Statistics", async () => {
    const res = await fetch(`${BASE_URL}/api/applications/stats`);
    assert.strictEqual(res.status, 200, "Should return HTTP 200");
    const stats = await res.json();
    assert.ok(typeof stats.total === "number", "Stats should include total count");
    assert.ok(typeof stats.Applied === "number", "Stats should include Applied count");
    assert.ok(typeof stats.Interview === "number", "Stats should include Interview count");
    assert.ok(typeof stats.Offer === "number", "Stats should include Offer count");
    assert.ok(typeof stats.Rejected === "number", "Stats should include Rejected count");
  });

  test("3. POST /api/applications - Validation Error on Missing Required Fields", async () => {
    const res = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: "Missing company and role" })
    });
    assert.strictEqual(res.status, 400, "Should reject with HTTP 400");
    const data = await res.json();
    assert.ok(data.message, "Response should have an error message");
  });

  test("4. POST /api/applications - Create Application (CRUD: Create)", async () => {
    const newApp = {
      company: "Automated Test Corp",
      role: "QA Automation Engineer",
      jobLink: "https://example.com/jobs/qa",
      salaryExpectation: 850000,
      status: "Applied",
      notes: "Created during automated API test suite execution"
    };

    const res = await fetch(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newApp)
    });

    assert.strictEqual(res.status, 201, "Should return HTTP 201 Created");
    const data = await res.json();
    assert.ok(data._id, "Created application must have an _id");
    assert.strictEqual(data.company, newApp.company);
    assert.strictEqual(data.role, newApp.role);
    assert.strictEqual(data.salaryExpectation, newApp.salaryExpectation);
    createdId = data._id;
  });

  test("5. GET /api/applications - List All Applications (CRUD: Read)", async () => {
    const res = await fetch(`${BASE_URL}/api/applications`);
    assert.strictEqual(res.status, 200, "Should return HTTP 200");
    const data = await res.json();
    assert.ok(Array.isArray(data), "Should return an array of applications");
    assert.ok(data.length > 0, "Array should contain at least the created application");
  });

  test("6. GET /api/applications?search=... - Search Filtering", async () => {
    const res = await fetch(`${BASE_URL}/api/applications?search=Automated+Test+Corp`);
    assert.strictEqual(res.status, 200, "Should return HTTP 200");
    const data = await res.json();
    assert.ok(Array.isArray(data), "Search results should be an array");
    const found = data.some((app) => app.company === "Automated Test Corp");
    assert.ok(found, "Search should return the matching company");
  });

  test("7. GET /api/applications?status=Applied - Status Filtering", async () => {
    const res = await fetch(`${BASE_URL}/api/applications?status=Applied`);
    assert.strictEqual(res.status, 200, "Should return HTTP 200");
    const data = await res.json();
    assert.ok(data.every((app) => app.status === "Applied"), "All returned items must have status 'Applied'");
  });

  test("8. PUT /api/applications/:id - Update Application (CRUD: Update)", async () => {
    assert.ok(createdId, "Test ID should exist from creation step");

    const updatePayload = {
      status: "Interview",
      interviewDate: new Date().toISOString(),
      notes: "Updated status to Interview via test suite"
    };

    const res = await fetch(`${BASE_URL}/api/applications/${createdId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload)
    });

    assert.strictEqual(res.status, 200, "Should return HTTP 200");
    const data = await res.json();
    assert.strictEqual(data.status, "Interview");
    assert.ok(data.interviewDate, "Should have interview date");
  });

  test("9. DELETE /api/applications/:id - Delete Application (CRUD: Delete)", async () => {
    assert.ok(createdId, "Test ID should exist");

    const res = await fetch(`${BASE_URL}/api/applications/${createdId}`, {
      method: "DELETE"
    });

    assert.strictEqual(res.status, 200, "Should return HTTP 200");
    const data = await res.json();
    assert.strictEqual(data.message, "Application deleted successfully");
  });

  test("10. DELETE /api/applications/:id - 404 for Non-Existent ID", async () => {
    const fakeId = "60c72b2f9b1d8b0015f8e000";
    const res = await fetch(`${BASE_URL}/api/applications/${fakeId}`, {
      method: "DELETE"
    });
    assert.strictEqual(res.status, 404, "Should return HTTP 404 Not Found");
  });
});
