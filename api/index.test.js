// filepath: c:\Users\tomas\apollo-server-vercel\api\index.test.js
import request from "supertest";
import handler from "./index.js"; // Import the handler function

// Helper function to create a simple server for testing the handler
const createTestServer = (handlerFn) => {
  return (req, res) => {
    // Simulate Vercel's request/response objects if needed,
    // but for basic testing, passing them directly often works.
    return handlerFn(req, res);
  };
};

describe("GraphQL API Endpoint", () => {
  const testServer = createTestServer(handler);

  it('should return "world" for the hello query', async () => {
    const response = await request(testServer)
      .post("/") // The path where Apollo middleware is applied
      .send({
        query: `
          query {
            hello
          }
        `,
      })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.hello).toBe("world");
    expect(response.body.errors).toBeUndefined();
  });

  it("should handle introspection query", async () => {
    // Basic check to ensure introspection is working
    const response = await request(testServer)
      .post("/")
      .send({
        query: `
          query IntrospectionQuery {
            __schema {
              types {
                name
              }
            }
          }
        `,
      })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.__schema).toBeDefined();
    expect(response.body.errors).toBeUndefined();
  });

  it("should return an error for an invalid query", async () => {
    const response = await request(testServer)
      .post("/")
      .send({
        query: `
          query {
            invalidField
          }
        `,
      })
      .expect("Content-Type", /json/)
      .expect(400); // Apollo Server typically returns 400 for invalid queries

    expect(response.body.data).toBeUndefined();
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toContain(
      'Cannot query field "invalidField" on type "Query"'
    );
  });
});
