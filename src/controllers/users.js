import userModel from "../models/user.js";
import bcrypt from "bcryptjs";
import {getToken} from "../utils/token.js"




const usersController = {
  register: async (req, res) => {
    try {
      const { nombre, contrasena, correo } = req.body;
      console.log("RECIBIDA EN REGISTRO", contrasena);
      const contraEncriptada = await bcrypt.hash(contrasena, 10);
      console.log("Hash generado:", contraEncriptada);
        
const esAdmin = correo === "t4lmarthapulido@gmail.com"

      const newUser = new userModel({
        nombre,
        contrasena: contraEncriptada,
        correo,
        admin: esAdmin
        
      });
      
      const userCreado = await newUser.save();
      res
        .status(201)
        .json({
          message: "usuario creado satisfactoriamente",
          data: userCreado,
        });
     
    } catch (error) {
      res
        .status(500)
        .json({
          message: "usuario no fue creado satisfactoriamente",
          data: error.message,
        });
    }
  },



login: async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    console.log('Correo recibido:', correo);
  console.log('Contraseña recibida:', contrasena);
      const userFound = await userModel.findOne({ correo });
      console.log("userfound", userFound);
      if (!userFound) {
        res.status(401).json({
          message: 'Unauthorized.*44',  //
          data: null,
        });
      } else {

        const validPassword = await bcrypt.compare(
          contrasena,
          userFound.contrasena
        );
        if (validPassword) {
          console.log("*57");
          const token = await getToken({
            id: userFound._id,
            nombre: userFound.nombre,
            admin: userFound.admin
          });
          console.log("token", token);
          if (token) {
            res.status(200).json({
              message: 'Welcome!',
              data: token,
              admin: userFound.admin
            });
          } else {
            res.status(401).json({
              message: 'An error occurred, please try again.',
              data: null,
            });
          }
        } else {
          res.status(401).json({
            message: 'Unauthorized.***75',
            data: null,
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        message: 'Error LOGEANDO USER.',
        data: error.message,
      });
    }
  },







};



export default usersController;
