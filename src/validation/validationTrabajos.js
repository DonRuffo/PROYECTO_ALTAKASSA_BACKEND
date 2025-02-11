import { check, validationResult } from "express-validator";

const validacionCrearTrabajo = () => {
    return [
        check('oferta')
        .trim()
        .notEmpty().withMessage('La oferta es obligatoria')
        .isMongoId().withMessage('La oferta debe ser un ID válido'),

        check('fecha')
        .optional()
        .isDate().withMessage('La fecha debe ser una fecha válida'),

        check('status')
        .optional()
        .isIn(['En espera', 'Agendado', 'Completado', 'Rechazado']).withMessage('El estado debe ser uno de los siguientes: En espera, Agendado, Completado, Rechazado'),

        check('servicio')
        .trim()
        .notEmpty().withMessage('El servicio es obligatorio')
        .isLength({ min: 2, max: 100 }).withMessage('El servicio debe tener entre 2 y 100 caracteres'),

        check('tipo')
        .trim()
        .notEmpty().withMessage('El tipo es obligatorio'),

        check('desde')
        .optional()
        .isString().withMessage('Desde debe ser una cadena de texto'),

        check('hasta')
        .optional()
        .isString().withMessage('Hasta debe ser una cadena de texto'),

        check('precioTotal')
        .trim()
        .notEmpty().withMessage('El precio total es obligatorio')
        .isNumeric().withMessage('El precio total debe ser un número')
        .isFloat({ min: 0 }).withMessage('El precio total debe ser mayor a 0'),

        (req, res, next) => {
            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                const checkError = errores.array().map(error => error.msg);
                return res.status(400).json({ msg: checkError });
            }
            next();
        }
    ];
}

const validacionActualizarTrabajo = () => {
    return [
        check('fecha')
        .optional()
        .isDate().withMessage('La fecha debe ser una fecha válida'),

        check('status')
        .optional()
        .isIn(['En espera', 'Agendado', 'Completado', 'Rechazado']).withMessage('El estado debe ser uno de los siguientes: En espera, Agendado, Completado, Rechazado'),

        check('servicio')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('El servicio debe tener entre 2 y 100 caracteres'),

        check('tipo')
        .optional()
        .trim()
        .notEmpty().withMessage('El tipo es obligatorio'),

        check('desde')
        .optional()
        .isString().withMessage('Desde debe ser una cadena de texto'),

        check('hasta')
        .optional()
        .isString().withMessage('Hasta debe ser una cadena de texto'),

        (req, res, next) => {
            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                const checkError = errores.array().map(error => error.msg);
                return res.status(400).json({ msg: checkError });
            }
            next();
        }
    ];
}

export {
    validacionCrearTrabajo,
    validacionActualizarTrabajo
}