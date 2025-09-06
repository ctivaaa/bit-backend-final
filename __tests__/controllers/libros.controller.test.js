import { describe, expect, it, jest } from "@jest/globals"

const saveMock = jest.fn()

jest.unstable_mockModule("../../src/models/libro.js", () => {
  const mockConstructor = jest.fn(() => ({ save: saveMock }))
  mockConstructor.find = jest.fn()
  mockConstructor.findById = jest.fn()
  mockConstructor.findByIdAndUpdate = jest.fn()
  mockConstructor.findByIdAndDelete = jest.fn()
  return { default: mockConstructor }
})

const librosController = (await import("../../src/controllers/libros.js")).default
const libro = (await import("../../src/models/libro.js")).default

describe("create libro", () => {
  it("retorna 201 con el libro creado", async () => {
    const req = { body: { titulo: "Mi libro", autor: "Juan", calcetin: "rojo", valor: 100, unidades: 5, _id: "123" } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    const mockLibro = { ...req.body }
    saveMock.mockResolvedValue(mockLibro)

    await librosController.create(req, res)

    expect(saveMock).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      message: "libro creado satisfactoriamente",
      data: mockLibro
    })
  })

  it("retorna 500 si falla al guardar", async () => {
    const req = { body: { titulo: "Error book", autor: "Juan" } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    saveMock.mockRejectedValue(new Error("fallo en la DB"))

    await librosController.create(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      message: "libro no fue creado satisfactoriamente",
      data: "fallo en la DB"
    })
  })
})

describe("readAll libros", () => {
  it("retorna 200 con todos los libros", async () => {
    const req = {}
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    const mockLibros = [{ titulo: "Libro1" }, { titulo: "Libro2" }]
    libro.find.mockResolvedValue(mockLibros)

    await librosController.readAll(req, res)

    expect(libro.find).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: "libros encontrados satisfactoriamente",
      data: mockLibros
    })
  })

  
})

describe("readOne libro", () => {
  it("retorna 200 con el libro encontrado", async () => {
    const req = { params: { id: "123" } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    const mockLibro = { _id: "123", titulo: "Un libro" }
    libro.findById.mockResolvedValue(mockLibro)

    await librosController.readOne(req, res)

    expect(libro.findById).toHaveBeenCalledWith("123")
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: "libro fue leido por id satisfactoriamente",
      data: mockLibro
    })
  })

  it("retorna 404 si ocurre un error", async () => {
    const req = { params: { id: "456" } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    libro.findById.mockRejectedValue(new Error("no encontrado"))

    await librosController.readOne(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      message: "libro no fue leido por id satisfactoriamente",
      data: "no encontrado"
    })
  })
})

describe("update libro", () => {
  it("retorna 200 con el libro actualizado", async () => {
    const req = { params: { id: "123" }, body: { titulo: "Nuevo titulo" } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    const mockLibro = { _id: "123", titulo: "Nuevo titulo" }
    libro.findByIdAndUpdate.mockResolvedValue(mockLibro)

    await librosController.update(req, res)

    expect(libro.findByIdAndUpdate).toHaveBeenCalledWith("123", req.body)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: "libro fue actualizado satisfactoriamente",
      data: mockLibro
    })
  })

  it("retorna 304 si falla al actualizar", async () => {
    const req = { params: { id: "123" }, body: { titulo: "Error" } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    libro.findByIdAndUpdate.mockRejectedValue(new Error("fallo al actualizar"))

    await librosController.update(req, res)

    expect(res.status).toHaveBeenCalledWith(304)
    expect(res.json).toHaveBeenCalledWith({
      message: "libro no fue actualizado satisfactoriamente",
      data: "fallo al actualizar"
    })
  })
})

describe("delete libro", () => {
  it("retorna 200 con el libro eliminado", async () => {
    const req = { params: { id: "123" } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    const mockLibro = { _id: "123", titulo: "Eliminar libro" }
    libro.findByIdAndDelete.mockResolvedValue(mockLibro)

    await librosController.delete(req, res)

    expect(libro.findByIdAndDelete).toHaveBeenCalledWith("123")
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: "libro eliminado satisfactoriamente",
      data: mockLibro
    })
  })

  it("retorna 400 si falla al eliminar", async () => {
    const req = { params: { id: "456" } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    libro.findByIdAndDelete.mockRejectedValue(new Error("fallo al eliminar"))

    await librosController.delete(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      message: "libro no fue eliminado satisfactoriamente",
      data: "fallo al eliminar"
    })
  })
})
