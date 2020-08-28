import Joi, {ErrorReport, ValidationResult} from '@hapi/joi';

const schema = Joi.object({
    startDate: Joi.date()
        .required()
        .error((error: ErrorReport[]): any => {
            if (error[0].code) {
                switch (error[0].code) {
                    case 'date.empty':
                        error[0].message = 
                            'Data rozpoczęcia kolejki nie może być pusta!';
                        break;
                    default:
                        break;
                }
            }
            return error;
        }),
    endDate: Joi.date()
        .required()
        .error((error: ErrorReport[]): any => {
            if (error[0].code) {
                switch (error[0].code) {
                    case 'date.empty':
                        error[0].message = 
                            'Data zakończenia kolejki nie może być pusta!';
                        break;
                    default:
                        break;
                }
            }
            return error;
        }),
    number: Joi.number()
        .required()
        .min(1)
        .max(18)
        .error((error: ErrorReport[]): any => {
            if(error[0].code) {
                switch (error[0].code) {
                    case 'number.min':
                        error[0].message = 
                            'Numer kolejki nie może być niższy niż 1!';
                        break;
                    case 'number.max':
                        error[0].message = 
                            'Numer kolejki nie może być wyższy niż 18!';
                        break;
                    default:
                        break;
                }
            }
            return error;
        })
});

export default function validateRoundData(data: {
    startDate: Date;
    endDate: Date;
    number: number;
}): ValidationResult {
    return schema.validate(data, {abortEarly: false});
}