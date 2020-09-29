import Joi, { ErrorReport, ValidationResult } from '@hapi/joi';

const schema = Joi.object({
	name: Joi.string()
		.min(2)
		.max(255)
		.trim()
		.required()
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'string.min':
						error[0].message =
							'Nazwa ligi musi mieć przynajmniej 2 znaki';
						break;
					case 'string.max':
						error[0].message =
							'Nazwa ligi może mieć maksymalnie 255 znaków';
						break;
					case 'string.empty':
						error[0].message = 'Nazwa ligi nie może być pusta!';
						break;
					default:
						break;
				}
			}
			return error;
		}),
	country: Joi.string()
		.min(2)
		.max(255)
		.trim()
		.required()
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'string.min':
						error[0].message =
							'Karj ligi musi mieć przynajmniej 2 znaki';
						break;
					case 'string.max':
						error[0].message =
							'Karj ligi może mieć maksymalnie 255 znaków';
						break;
					case 'string.empty':
						error[0].message =
							'Kraj ligi nie może być pusty!';
						break;
					default:
						break;
				}
			}
			return error;
		})
});

export default function validateLeagueData(data: {
    name: string;
    country: string;
}): ValidationResult {
	return schema.validate(data, { abortEarly: false });
}
