import Joi, { ErrorReport, ValidationResult } from '@hapi/joi';

const schema = Joi.object({
	email: Joi.string()
		.trim()
		.email({ tlds: { allow: false } })
		.required()
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'string.empty':
						error[0].message = 'E-mail nie może być pusty!';
						break;
					case 'string.email':
						error[0].message = 'Wprowadź poprawny adres e-mail!';
						break;
					default:
						break;
				}
			}
			return error;
		}),
	username: Joi.string()
		.min(3)
		.max(255)
		.trim()
		.required()
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'string.min':
						error[0].message =
							'Nazwa musi mieć przynajmniej 3 znaki!';
						break;
					case 'string.max':
						error[0].message =
							'Nazwa może mieć maksymalnie 255 znaków!';
						break;
					case 'string.empty':
						error[0].message = 'Nazwa nie może być pusta!';
						break;
					default:
						break;
				}
			}
			return error;
		}),
	password: Joi.string().regex(
		/(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
	),
	repPassword: Joi.ref('password')
}).with('password', 'repPassword');

export default function validateRegisterData(data: {
	email: string;
	username: string;
	password: string;
	repPassword: string;
}): ValidationResult {
	return schema.validate(data, { abortEarly: false });
}
