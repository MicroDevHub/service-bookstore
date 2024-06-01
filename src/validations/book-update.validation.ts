import { Schema } from 'express-validator';

export const bookUpdateValidation: Schema = {
	id: {
		in: ['params'],
		notEmpty: true,
		isInt: true,
	},
	title: {
		in: ['body'],
		notEmpty: true,
		isLength: {
			options: { max: 30 },
		},
	},
	image: {
		in: ['body'],
		notEmpty: true,
	},
	quantity: {
		in: ['body'],
		notEmpty: true,
		isInt: true,
	},
	price: {
		in: ['body'],
		notEmpty: true,
		isInt: true,
	},
	description: {
		in: ['body'],
		notEmpty: true,
	},
	author: {
		in: ['body'],
		notEmpty: true,
	},
	categoryId: {
		in: ['body'],
		notEmpty: true,
	},
};
