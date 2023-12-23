import { Schema } from 'express-validator';

export const bookPagingValidation: Schema = {
  search: {
    in: ['query'],
    isString: true,
    optional: true,
  },
  limit: {
    in: ['query'],
    isInt: true,
    optional: true,
  },
  page: {
    in: ['query'],
    isInt: true,
    optional: true,
  },
  sortOrder: {
    in: ['query'],
    isInt: true,
    optional: true,
  },
  sortColumn: {
    in: ['query'],
    isString: true,
    optional: true,
  },
  categoryId: {
    in: ['query'],
    isString: true,
    optional: true,
  },
};
