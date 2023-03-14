import { app } from "./app";
import request from "supertest";

it("sets the Server header", async () =>
  request(app)
    .get(`/api/second-controller`)
    .expect(200)
    .expect("Server", /openclimate-hub-controller/)
    .expect("Server", /ElasticSearch/));
