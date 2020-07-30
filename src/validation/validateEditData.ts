import Joi, { ErrorReport, ValidationResult } from '@hapi/joi';

const schema = Joi.object({
	username: Joi.string()
		.trim()
		.allow('')
		.min(3)
		.max(255)
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
					default:
						break;
				}
			}
			return error;
		}),
	password: Joi.string()
		.allow('')
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
		),
	newPassword: Joi.string()
		.allow('')
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
		)
});

export default function validateEditData(data: {
	username: string;
	password: string;
	newPassword: string;
}): ValidationResult {
	return schema.validate(data, { abortEarly: false });
}
