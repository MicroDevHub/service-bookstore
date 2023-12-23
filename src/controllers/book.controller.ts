import { inject, injectable } from 'inversify';
import TYPES from '../constants/type';
import { IBookService } from '../interfaces/book.interface';
import { NextFunction, Request, Response } from 'express';
import { ILogger } from '@hh-bookstore/common';
import { BookCreateUpdateDto, BookQueryCriteria } from '../models/book.model';
import { ORDER } from '../models/pagination-model/base-query-criteria';

@injectable()
export class BookController {
	constructor(
		@inject(TYPES.IBookService) private bookServices: IBookService,
    @inject(TYPES.ILogger) private logger: ILogger
	) {}

	async getBooks(req: Request, res: Response, next: NextFunction) {
		try {
			const books = await this.bookServices.get();

			this.logger.info('Get All Books')
			res.status(200).json(books);
		} catch (err) {
			next(err)
		}
	}

	async getById(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;

			this.logger.info('Get Book By Id')
			const book = await this.bookServices.getById(Number(id));

			res.status(200).json(book);
		} catch (err) {
			next(err);
		}
	}

	async getBookByPagination(req: Request, res: Response, next: NextFunction) {
		try {
			const { search, limit, page, sortOrder, sortColumn, categoryId } =
				req.query;

			const query: BookQueryCriteria = {
				search: search ?? '',
				limit: limit ? Number(limit) : 12,
				page: page ? Number(page) : 1,
				sortOrder: Number(sortOrder) === 0 ? ORDER.ASC : ORDER.DESC,
				sortColumn: sortColumn ?? 'id',
				categoryId: categoryId,
			} as BookQueryCriteria;

			this.logger.info('Get books by pagination')
			const bookPaging = await this.bookServices.getByPaging(query);

			res.status(200).json(bookPaging);
		} catch (err) {
			this.logger.error(`Get Book By Pagination: ${err}`)
			next(err)
		}
	}

	async createBook(req: Request, res: Response, next: NextFunction) {
		try {
			const { title, image, quantity, price, author, description, categoryId } = req.body;

			const bookParams: BookCreateUpdateDto = {
				title,
				image,
				author,
				description,
				categoryId: Number(categoryId),
				quantity: Number(quantity),
				price: Number(price),
			};

			this.logger.info('Create a new book')
			const newBook = await this.bookServices.createBook(bookParams);

			res.status(200).json(newBook);
		} catch (err) {
			this.logger.error(`Create Book: ${err}`)
			next(err);
		}
	}

	async updateBook(req: Request,res: Response,next: NextFunction) {
		try {
			const { id } = req.params;
			const { title, image, quantity, price, author, description, categoryId } = req.body;

			const bookParams: BookCreateUpdateDto = {
				title,
				image,
				author,
				description,
				categoryId: Number(categoryId),
				quantity: Number(quantity),
				price: Number(price),
			};

			this.logger.info('Update a new book');
			const updatedBook = await this.bookServices.updateBook(
				Number(id),
				bookParams
			);

			res.status(200).json(updatedBook);
		} catch (err) {
			this.logger.error(`Update book: ${err}`);
			next(err);
		}
	}

	async deleteBook(req: Request,res: Response, next: NextFunction) {
		try {
			const { id } = req.params;

			this.logger.info('Remove a new book');
			await this.bookServices.deleteBook(Number(id));

			res.status(200).json({ message: 'Remove book successfully' });
		} catch (err) {
			this.logger.error(`Delete book: ${err}`);
			next(err);
		}
	}
}
