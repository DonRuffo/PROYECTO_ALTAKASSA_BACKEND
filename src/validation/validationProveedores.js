import { check, validationResult } from "express-validator";

const validacionRegistroProveedor = () => {
    return[
        check('nombre')
        .trim()
        .notEmpty().withMessage("El campo nombre es obligatorio")
        .isLength({min:2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres")
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage("El nombre solo puede contener letras y espacios"),

        check('apellido')
        .trim()
        .notEmpty().withMessage('El apellido es obligatorio')
        .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El apellido solo puede contener letras y espacios'),

        check('direccion')
        .trim()
        .notEmpty().withMessage('La dirección es obligatoria')
        .isLength({ min: 5, max: 100 }).withMessage('La dirección debe tener entre 5 y 100 caracteres'),

        check('email')
        .trim()
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Debe ser un email válido'),

        check('telefono')
        .trim()
        .notEmpty().withMessage('El teléfono es obligatorio')
        .isMobilePhone().withMessage('Debe ser un número de teléfono válido'),

        check('contrasenia')
        .trim()
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 10 }).withMessage('La contraseña debe tener al menos 10 caracteres')
        .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
        .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula')
        .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número'),

        (req,res,next) => {
            const errores = validationResult(req)

            if(!errores.isEmpty()){
                const checkError = errores.array().map(error=>error.msg)

                return res.status(400).json({msg:checkError})
            }
            next()
        }

    ]
}

const validacionRecuperarPassProveedor = () => {
    return [

        check('contrasenia')
        .trim()
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 10 }).withMessage('La contraseña debe tener al menos 10 caracteres')
        .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
        .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula')
        .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número'),

        (req,res,next) => {
            const errores = validationResult(req)
            
            if(!errores.isEmpty()) {
                const checkError = errores.array().map(error => error.msg)

                return res.status(400).json({msg:checkError})

            }
            next();
        }   
    ]
}

const validacionActualizarProveedor = () => {
    return[
        check('nombre')
        .optional().trim()
        .notEmpty().withMessage("El campo nombre es obligatorio")
        .isLength({min:2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres")
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage("El nombre solo puede contener letras y espacios"),

        check('apellido')
        .optional().trim()
        .notEmpty().withMessage('El apellido es obligatorio')
        .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El apellido solo puede contener letras y espacios'),

        check('direccion')
        .optional().trim()
        .notEmpty().withMessage('La dirección es obligatoria')
        .isLength({ min: 5, max: 100 }).withMessage('La dirección debe tener entre 5 y 100 caracteres'),

        check('email')
        .optional().trim()
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Debe ser un email válido'),

        check('telefono')
        .optional().trim()
        .notEmpty().withMessage('El teléfono es obligatorio')
        .isMobilePhone().withMessage('Debe ser un número de teléfono válido'),

        check('profesiones')
        .optional().trim()
        .notEmpty().withMessage('La profesión es obligatorio')
        .isLength({ min: 2, max: 50 }).withMessage('La profesión debe tener entre 2 y 50 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('La profesión solo puede contener letras y espacios'),

        (req,res,next) => {
            const errores = validationResult(req)

            if(!errores.isEmpty()){
                const checkError = errores.array().map(error=>error.msg)

                return res.status(400).json({msg:checkError})
            }
            next()
        }

    ]
}

const validacionActualizarPassProveedor = () => {
    return [

        check('nuevaContrasenia')
        .trim()
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 10 }).withMessage('La contraseña debe tener al menos 10 caracteres')
        .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
        .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula')
        .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número'),

        (req,res,next) => {
            const errores = validationResult(req)
            
            if(!errores.isEmpty()) {
                const checkError = errores.array().map(error => error.msg)

                return res.status(400).json({msg:checkError})

            }
            next();
        }   
    ]
}

export {
    validacionRegistroProveedor,
    validacionRecuperarPassProveedor,
    validacionActualizarProveedor,
    validacionActualizarPassProveedor
}