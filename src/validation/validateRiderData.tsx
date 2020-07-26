import Joi, { ErrorReport, ValidationResult } from '@hapi/joi';

const schema = Joi.object({
    firstName: Joi.string()
        .min(2)
        .max(255)
        .trim()
        .required()
        .error((error: ErrorReport[]): any => {
            if(error[0].code) {
                switch(error[0].code){
                    case 'string.min':
                        error[0].message =
                            'Imię zawodnika musi mieć przynajmniej 2 znaki';
                        break;
                    case 'string.max':
                        error[0].message =
                            'Imię zawodnika może mieć maksymalnie 255 znaków';
                        break;
                    case 'string.empty':
                        error[0].message =
                            'Imię zawodnika nie może być puste!';
                        break;
                    default:
                        break;
                }
            }
            return error;
        }),
    lastName: Joi.string()
        .min(2)
        .max(255)
        .trim()
        .required()
        .error((error: ErrorReport[]): any => {
            if(error[0].code) {
                switch(error[0].code){
                    case 'string.min':
                        error[0].message =
                            'Nazwisko zawodnika musi mieć przynajmniej 2 znaki';
                        break;
                    case 'string.max':
                        error[0].message =
                            'Nazwisko zawodnika może mieć maksymalnie 255 znaków';
                        break;
                    case 'string.empty':
                        error[0].message =
                            'Nazwisko zawodnika nie może być puste!';
                        break;
                    default:
                        break;
                }
            }
            return error;
        }),
    nickname: Joi.string()
        .min(2)
        .max(255)
        .trim()
        .error((error: ErrorReport[]): any => {
            if(error[0].code) {
                switch(error[0].code){
                    case 'string.min':
                        error[0].message =
                            'Przydomek zawodnika musi mieć przynajmniej 2 znaki';
                        break;
                    case 'string.max':
                        error[0].message =
                            'Przydomek zawodnika może mieć maksymalnie 255 znaków';
                        break;
                    default:
                        break;
                }
            }
            return error;
        }),
    dateOfBirth: Joi.date()
        .required()
        .error((error: ErrorReport[]): any => {
            if (error[0].code) {
                switch(error[0].code){
                    case 'date.empty':
                        error[0].message =
                            'Data urodzenia zawodnika nie może być pusta';
                        break;
                    default:
                        break;
                }
            }
            return error;
        }),
    club: Joi.string()
        .min(2)
        .max(255)
        .trim()
        .required()
        .error((error: ErrorReport[]): any => {
            if(error[0].code) {
                switch(error[0].code){
                    case 'string.min':
                        error[0].message =
                            'Klub zawodnika musi mieć przynajmniej 2 znaki';
                        break;
                    case 'string.max':
                        error[0].message =
                            'Klub zawodnika może mieć maksymalnie 255 znaków';
                        break;
                    case 'string.empty':
                        error[0].message =
                            'Klub zawodnika nie może być puste!';
                        break;
                    default:
                        break;
                }
            }
            return error;
        }),
});

export default function validateRiderData(data: {
    firstName: string;
    lastName: string;
    nickname: string;
    dateOfBirth: Date;
    club: string;
}): ValidationResult {
    return schema.validate(data, {abortEarly: false});
}