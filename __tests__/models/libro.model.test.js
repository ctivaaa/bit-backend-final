import mongoose from "mongoose";
import Libro from "../../src/models/libro.js";
import { afterAll, afterEach, beforeAll, describe, it, expect, jest } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer, mockLibro, mockObjLibro;

beforeAll(async () => {
  mockObjLibro = {
    _id: 1,
    titulo: "AAAA",
    autor: "AAA",
    calcetin: "azul",
    valor: 5000,
    unidades: 10
  };



  mockLibro = new Libro(mockObjLibro);
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
afterEach(async () => {
  await Libro.deleteMany();
});
describe("Pruebas del modelo Libro", () => {
  it("Debería guardar un libro correctamente", async () => {
    



    const libroGuardado = await mockLibro.save();





    expect(libroGuardado._id).toBeDefined();
    expect(libroGuardado.titulo).toBe("AAAA");
    expect(libroGuardado.autor).toBe("AAA");
    expect(libroGuardado.calcetin).toBe("azul");
    expect(libroGuardado.valor).toBe(5000);
    expect(libroGuardado.unidades).toBe(10);
  });

  it("Debería rechazar id duplicados", async () => {
    await Libro.create(mockObjLibro);
    let err;
    try {
      await Libro.create(mockObjLibro);
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); //
  });
});
