import Joi, { ErrorReport, ValidationResult } from '@hapi/joi';

const schema = Joi.object({
	firstName: Joi.string()
		.min(2)
		.max(255)
		.trim()
		.required()
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'string.min':
						error[0].message =
							'Imię zawodnika musi mieć przynajmniej 2 znaki';
						break;
					case 'string.max':
						error[0].message =
							'Imię zawodnika może mieć maksymalnie 255 znaków';
						break;
					case 'string.empty':
						error[0].message = 'Imię zawodnika nie może być puste!';
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
			if (error[0].code) {
				switch (error[0].code) {
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
		.max(255)
		.allow('')
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
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
				switch (error[0].code) {
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
	isForeigner: Joi.boolean()
		.required()
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				error[0].message = 'Niepoprawna narodowość zawodnika!';
			}
			return error;
		}),
	KSM: Joi.number()
		.required()
		.min(2.5)
		.max(12.0)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za niski ksm!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoki ksm!';
						break;
					default:
						break;
				}
			}
			return error;
		}),
	clubId: Joi.string()
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
        })
});

export default function validateRiderData(data: {
	firstName: string;
	lastName: string;
	nickname: string;
	dateOfBirth: Date;
	isForeigner: boolean;
	KSM: number;
	clubId: string;
}): ValidationResult {
	return schema.validate(data, { abortEarly: false });
}
