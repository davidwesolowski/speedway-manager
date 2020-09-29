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
	mainLeague: Joi.string()
		.min(2)
		.max(255)
		.trim()
		.required()
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'string.empty':
						error[0].message =
							'Liga nadrzędna musi być wybrana!';
						break;
					default:
						break;
				}
			}
			return error;
		})
});

export default function validateUserLeagueData(data: {
    name: string;
    mainLeague: string;
}): ValidationResult {
	return schema.validate(data, { abortEarly: false });
}
