import { describe, expect, it, jest } from "@jest/globals"

const guardarSimulado = jest.fn()
const encriptarSimulado = jest.fn()
const compararSimulado = jest.fn()
const tokenSimulado = jest.fn()


jest.unstable_mockModule("../../src/models/user.js", () => {
  const simulador = jest.fn(() => ({ save: guardarSimulado }))
  simulador.findOne = jest.fn()
  return { default: simulador }
})

// para bcrypt
jest.unstable_mockModule("bcryptjs", () => ({
  default: { hash: encriptarSimulado, compare: compararSimulado },
  hash: encriptarSimulado,
  compare: compararSimulado
}))

// simulo token
jest.unstable_mockModule("../../src/utils/token.js", () => ({
  getToken: tokenSimulado
}))

const usersController = (await import("../../src/controllers/users.js")).default
const usuario = (await import("../../src/models/user.js")).default


describe("usersController.register", () => {
  it("debería crear un usuario correctamente", async () => {
    const req = {
      body: { nombre: "Juan", contrasena: "1234", correo: "juan@test.com" }
    }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    const usuarioSimulado = { _id: "1", ...req.body, admin: false }

    encriptarSimulado.mockResolvedValue("claveEncriptada")
    guardarSimulado.mockResolvedValue(usuarioSimulado)

    await usersController.register(req, res)

    expect(encriptarSimulado).toHaveBeenCalledWith("1234", 10)
    expect(guardarSimulado).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      message: "usuario creado satisfactoriamente",
      data: usuarioSimulado
    })
  })

  it("debería devolver 500 si ocurre un error en el registro", async () => {
    const req = {
      body: { nombre: "Juan", contrasena: "1234", correo: "juan@test.com" }
    }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    encriptarSimulado.mockRejectedValue(new Error("error al encriptar"))

    await usersController.register(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      message: "usuario no fue creado satisfactoriamente",
      data: "error al encriptar"
    })
  })
})


describe("usersController.login", () => {
  it("debería devolver 401 si la contraseña no coincide", async () => {
    const req = { body: { correo: "juan@test.com", contrasena: "mal" } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    const usuarioSimulado = { _id: "1", nombre: "Juan", contrasena: "aaa", admin: false }
    usuario.findOne.mockResolvedValue(usuarioSimulado)
    compararSimulado.mockResolvedValue(false)

    await usersController.login(req, res)

    expect(compararSimulado).toHaveBeenCalledWith("mal", "aaa")
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized.***75",
      data: null
    })
  })

  it("debería dar estado 200 y token si el inicio de sesión es válido", async () => {
    const req = { body: { correo: "juan@test.com", contrasena: "1234" } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    const usuarioSimulado = { _id: "1", nombre: "Juan", contrasena: "aaa", admin: false }
    usuario.findOne.mockResolvedValue(usuarioSimulado)
    compararSimulado.mockResolvedValue(true)
    tokenSimulado.mockResolvedValue("token-falso")

    await usersController.login(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: "Welcome!",
      data: "token-falso",
      admin: false
    })
  })
})
