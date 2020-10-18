import Joi, { ErrorReport, ValidationResult } from '@hapi/joi';

const schema = Joi.object({
	home_id: Joi.string()
		.trim()
		.required()
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'string.empty':
						error[0].message = 'Klub gospodarza nie może być pusty!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
    away_id: Joi.string()
        .trim()
        .required()
        .error((error: ErrorReport[]): any => {
            if (error[0].code) {
                switch (error[0].code) {
                    case 'string.empty':
                        error[0].message = 'Klub gościa nie może być pusty!';
                        break;
                    default:
                        break;
                }
            }
            return error;
        }),
    points_1: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
		}),
    points_2: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
    points_3: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
    points_4: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
    points_5: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
                        error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
    points_6: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
    points_7: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
    points_8: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
    points_9: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
    points_10: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
    points_11: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
    points_12: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
    points_13: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
    points_14: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
    points_15: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
    points_16: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
		}),
		heats_1: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
		}),
		heats_2: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
		heats_3: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
		heats_4: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
		heats_5: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
                        error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
		heats_6: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
		heats_7: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
		heats_8: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
		heats_9: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
		heats_10: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
		heats_11: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
		heats_12: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
		heats_13: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
		heats_14: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
		heats_15: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
        }),
    heats_16: Joi.number()
        .allow('')
		.min(0)
		.max(21)
		.error((error: ErrorReport[]): any => {
			if (error[0].code) {
				switch (error[0].code) {
					case 'number.min':
						error[0].message = 'Za mała ilość punktów!';
						break;
					case 'number.max':
						error[0].message = 'Za wysoka ilość punktów!';
						break;
					default:
						break;
				}
			}
			return error;
		})
});

export default function validateMatchPointsData(data: {
    home_id: string;
    away_id: string;
    points_1: number;
    points_2: number;
    points_3: number;
    points_4: number;
    points_5: number;
    points_6: number;
    points_7: number;
    points_8: number;
    points_9: number;
    points_10: number;
    points_11: number;
    points_12: number;
    points_13: number;
    points_14: number;
    points_15: number;
	points_16: number;
	heats_1: number;
	heats_2: number;
	heats_3: number;
	heats_4: number;
	heats_5: number;
	heats_6: number;
	heats_7: number;
	heats_8: number;
	heats_9: number;
	heats_10: number;
	heats_11: number;
	heats_12: number;
	heats_13: number;
	heats_14: number;
	heats_15: number;
	heats_16: number;
}): ValidationResult {
	return schema.validate(data, { abortEarly: false });
}