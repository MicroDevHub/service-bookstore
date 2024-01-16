import { inject, injectable } from 'inversify';
import { IBookService } from '../interfaces/book.interface';
import {
	BookModel,
	BookCreateUpdateDto,
	BookQueryCriteria,
} from '../models/book.model';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@hh-bookstore/common';
import { PagedResponseModel } from '../models/pagination-model/paged-response-model';
import { PageModel } from '../models/pagination-model/paged-model';
import TYPES from '../constants/type';

@injectable()
export class BookService implements IBookService {
	constructor(@inject(TYPES.PrismaClient) private prismaClient: PrismaClient) {}

	async getByPaging(
		query: BookQueryCriteria
	): Promise<PagedResponseModel<BookModel>> {
		const filter: any = {
			isDeleted: false,
		};

		if (query.search) {
			filter.title = { contains: query.search, mode: 'insensitive' };
		}

		if (query.categoryId) {
			filter.category_id = query.categoryId;
		}

		const paged = {} as PageModel<BookModel>;

		paged.currentPage = query.page < 0 ? 1 : query.page;
		paged.pageSize = query.limit || 12;
		paged.totalItems = await this.prismaClient.books.count({
			where: filter,
		});
		paged.totalPages = Math.ceil(paged.totalItems / paged.pageSize);

		const startRow = (paged.currentPage - 1) * paged.pageSize;

		const books = await this.prismaClient.books.findMany({
			skip: startRow,
			take: paged.pageSize,
			where: filter,
			orderBy: {
				[query.sortColumn]: query.sortOrder,
			},
			include: { categories: true },
		});

		const pagedResponseModel: PagedResponseModel<BookModel> = {
			totalItems: paged.totalItems,
			totalPages: paged.totalPages,
			currentPage: paged.currentPage,
			items: books.map((book) => {
				return {
					title: book.title,
					image: book.image,
					quantity: book.quantity,
					price: book.price,
					description: book.description,
					author: book.author,
					category: book.categories,
				} as BookModel;
			}),
		};

		return pagedResponseModel;
	}

	async get(): Promise<BookModel[]> {
		const books = await this.prismaClient.books.findMany({
			include: {
				categories: true,
			},
		});
		return books.map((book) => {
			return {
				title: book.title,
				image: book.image,
				quantity: book.quantity,
				price: book.price,
				description: book.description,
				author: book.author,
				category: book.categories,
			} as BookModel;
		});
	}

	async getById(id: number): Promise<BookModel> {
		const book = await this.prismaClient.books.findFirst({
			include: {
				categories: true,
			},
			where: { id: id },
		});
		if (!book) {
			throw new NotFoundError();
		}

		const bookDto: BookModel = {
			id: book.id,
			title: book.title,
			image: book.image,
			quantity: book.quantity,
			price: book.price,
			description: book.description,
			author: book.author,
			category: book.categories,
		};

		return bookDto;
	}

	async createBook(bookCreateDto: BookCreateUpdateDto): Promise<BookModel> {
		const categoryRef = await this.prismaClient.categories.findUnique({
			where: {
				id: bookCreateDto.categoryId,
			},
		});
		if (!categoryRef) {
			throw new NotFoundError();
		}

		const book = await this.prismaClient.books.create({
			data: {
				title: bookCreateDto.title,
				image: bookCreateDto.image,
				author: bookCreateDto.author,
				description: bookCreateDto.description,
				quantity: bookCreateDto.quantity,
				price: bookCreateDto.price,
				category_id: bookCreateDto.categoryId,
			},
		});

		const bookDto: BookModel = {
			id: book.id,
			title: book.title,
			image: book.image,
			quantity: book.quantity,
			price: book.price,
			description: book.description,
			author: book.author,
			category: categoryRef,
		};

		return bookDto;
	}

	async updateBook(
		id: number,
		bookUpdateDto: BookCreateUpdateDto
	): Promise<BookModel> {
		const bookUpdate = await this.prismaClient.books.findFirst({
			where: { id: id },
		});

		if (!bookUpdate) {
			throw new NotFoundError();
		}

		const categoryRef = await this.prismaClient.categories.findFirst({
			where: { id: bookUpdateDto.categoryId },
		});

		if (!categoryRef) {
			throw new NotFoundError();
		}

		const updatedBook = await this.prismaClient.books.update({
			where: { id: id },
			data: {
				title: bookUpdateDto.title,
				image: bookUpdateDto.image,
				author: bookUpdateDto.author,
				description: bookUpdateDto.description,
				quantity: bookUpdateDto.quantity,
				price: bookUpdateDto.price,
				category_id: bookUpdateDto.categoryId,
				updated_date: new Date(),
			},
		});

		const bookDto: BookModel = {
			id: updatedBook.id,
			title: updatedBook.title,
			image: updatedBook.image,
			quantity: updatedBook.quantity,
			price: updatedBook.price,
			description: updatedBook.description,
			author: updatedBook.author,
			category: categoryRef,
		};

		return bookDto;
	}

	async deleteBook(id: number): Promise<number> {
		const bookUpdate = await this.prismaClient.books.findFirst({
			where: { id: id },
		});

		if (!bookUpdate) {
			throw new NotFoundError();
		}

		const updatedBook = await this.prismaClient.books.update({
			where: { id: id },
			data: {
				updated_date: new Date(),
				isDeleted: true,
			},
		});

		return updatedBook.id;
	}
}
