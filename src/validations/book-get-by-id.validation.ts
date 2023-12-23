import { Schema } from 'express-validator';

export const bookGetByIdValidation: Schema = {
  id: {
    in: ['params'],
    notEmpty: true,
  },
};
