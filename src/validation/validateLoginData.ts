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
	password: Joi.string()
		.required()
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'string.empty':
						error[0].message = 'Hasło nie może być puste!';
						break;
					default:
						break;
				}
			}
			return error;
		})
});

export default function validateLoginData(data: {
	email: string;
	password: string;
}): ValidationResult {
	return schema.validate(data, { abortEarly: false });
}
