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
	password: Joi.string()
		.min(6)
		.max(1024)
		.required()
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'string.empty':
						error[0].message = 'Hasło nie może być puste!';
						break;
					case 'string.min':
						error[0].message =
							'Hasło musi mieć przynajmniej 6 znaków!';
						break;
					case 'string.max':
						error[0].message =
							'Hasło może mieć maksymalnie 1024 znaki!';
						break;
					default:
						break;
				}
			}
			return error;
		}),
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
