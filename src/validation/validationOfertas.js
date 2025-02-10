import { check, validationResult } from "express-validator";
import mongoose from "mongoose";

const validacionCrearOfertas = () => {
    return [
        check('precioPorDia')
        .trim()
        .notEmpty().withMessage("El precio por día es obligatorio")
        .isNumeric().withMessage("El precio por día debe ser un número")
        .isFloat({ min: 0 }).withMessage("El precio por día debe ser mayor a 0"),

        check('precioPorHora')
        .trim()
        .notEmpty().withMessage("El precio por hora es obligatorio")
        .isNumeric().withMessage("El precio por hora debe ser un número")
        .isFloat({ min: 0 }).withMessage("El precio por hora debe ser mayor a 0"),

        check('servicio')
        .trim()
        .notEmpty().withMessage("El servicio es obligatorio")
        .isLength({ min: 2, max: 100 }).withMessage("El servicio debe tener entre 2 y 100 caracteres")
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage("El servicio solo puede contener letras y espacios"),

        check('descripcion')
        .trim()
        .notEmpty().withMessage("La descripción es obligatoria")
        .isLength({ min: 10, max: 500 }).withMessage("La descripción debe tener entre 10 y 500 caracteres"),

        (req, res, next) => {
            const errores = validationResult(req)
            if(!errores.isEmpty()){
                const checkError = errores.array().map(error => error.msg)
                return res.status(400).json({msg: checkError})
            }
            next()
        }
    ]
}

const validacionActualizarOfertas = () => {
    return [
        check('precioPorDia')
        .optional()
        .trim()
        .notEmpty().withMessage("El precio por día es obligatorio")
        .isNumeric().withMessage("El precio por día debe ser un número")
        .isFloat({ min: 0 }).withMessage("El precio por día debe ser mayor a 0"),

        check('precioPorHora')
        .optional()
        .trim()
        .notEmpty().withMessage("El precio por hora es obligatorio")
        .isNumeric().withMessage("El precio por hora debe ser un número")
        .isFloat({ min: 0 }).withMessage("El precio por hora debe ser mayor a 0"),

        check('servicio')
        .optional()
        .trim()
        .notEmpty().withMessage("El servicio es obligatorio")
        .isLength({ min: 2, max: 100 }).withMessage("El servicio debe tener entre 2 y 100 caracteres")
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage("El servicio solo puede contener letras y espacios"),

        check('descripcion')
        .optional()
        .trim()
        .notEmpty().withMessage("La descripción es obligatoria")
        .isLength({ min: 10, max: 500 }).withMessage("La descripción debe tener entre 10 y 500 caracteres"),

        (req, res, next) => {
            const errores = validationResult(req)
            if(!errores.isEmpty()){
                const checkError = errores.array().map(error => error.msg)
                return res.status(400).json({msg: checkError})
            }
            next()
        }
    ]
}

export {
    validacionCrearOfertas,
    validacionActualizarOfertas
}