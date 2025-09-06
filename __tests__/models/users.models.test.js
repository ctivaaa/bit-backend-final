import mongoose from "mongoose";
import User from "../../src/models/user.js";
import { afterAll, afterEach, beforeAll, describe, it, expect } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer, mockUser, mockObjUser;

beforeAll(async () => {
  mockObjUser = { nombre: "Juan", correo: "juan@test.com", contrasena: "1234", admin: false };
  mockUser = new User(mockObjUser);
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("Pruebas modelo User", () => {
  it("Debería guardar un usuario correctamente", async () => {
    const savedUser = await mockUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.nombre).toBe("Juan");
    expect(savedUser.correo).toBe("juan@test.com");
    expect(savedUser.contrasena).toBe("1234");
    expect(savedUser.admin).toBe(false);
  });

  
});
