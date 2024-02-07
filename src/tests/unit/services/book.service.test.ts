import 'reflect-metadata';
import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';
import TYPES from '../../../constants/type';
import { BookService } from '../../../services';
import { BookModel, BookQueryCriteria } from '../../../models/book.model';
import { ProducerInstance } from '@micro-dev-hub/kafka-event-sourcing/build/producer/producer';
import { ORDER } from '../../../constants/sort-order.enum';

jest.mock('@hh-bookstore/common', () => {
	return {
		NotFoundError: jest.fn(() => {
			return Promise.reject(new Error('Not Found Item'));
		}),
	};
});

let bookId = 1;
let categoryId = 1;

const mockBooks = [
	{
		id: 1,
		title: 'The Great Gatsby',
		image: 'https://example.com/great-gatsby.jpg',
		quantity: 15,
		price: 12,
		description:
			'The Great Gatsby is a novel written by American author F. Scott Fitzgerald.',
		author: 'F. Scott Fitzgerald',
		categories: {
			id: 1,
			name: 'sport',
		},
	},
	{
		id: 2,
		title: 'To Kill a Mockingbird',
		image: 'https://example.com/to-kill-a-mockingbird.jpg',
		quantity: 20,
		price: 10,
		description:
			'To Kill a Mockingbird is a novel by Harper Lee published in 1960.',
		author: 'Harper Lee',
		categories: {
			id: 2,
			name: 'drama',
		},
	},
	{
		id: 3,
		title: '1984',
		image: 'https://example.com/1984.jpg',
		quantity: 12,
		price: 14,
		description:
			'1984 is a dystopian social science fiction novel by George Orwell.',
		author: 'George Orwell',
		categories: {
			id: 3,
			name: 'comedy',
		},
	},
];

describe('BookService', () => {
	let container: Container;
	let bookService: BookService;

	const mockPrismaClient = {
		books: {
			findMany: jest.fn().mockResolvedValue(mockBooks),
			count: jest.fn().mockResolvedValue(3),
			findUnique: jest.fn().mockImplementation(() => {
				if (bookId === 1) {
					return mockBooks[0];
				} else {
					return null;
				}
			}),
			create: jest.fn().mockResolvedValue({
				id: 4,
				title: 'New book',
				image: 'New book',
				quantity: 1,
				price: 1,
				description: 'New book description',
				author: 'author new book',
				categoryId: 1,
			}),
			update: jest.fn().mockResolvedValue({
				id: 1,
				title: 'Update book',
				image: 'Update book',
				quantity: 2,
				price: 2,
				description: 'Update book description',
				author: 'update author',
				categoryId: 1,
			}),
		},
		categories: {
			findUnique: jest.fn().mockImplementation(() => {
				if (categoryId === 1) {
					return {
						id: 1,
						name: 'sport',
					};
				} else {
					return null;
				}
			}),
		},
	};

	const mockKafkaProducerServices = {
		send: jest.fn(),
		connect: jest.fn(),
	};

	beforeEach(() => {
		bookId = 1;
		categoryId = 1;
		container = new Container();

		container
			.bind<PrismaClient>(TYPES.PrismaClient)
			.toConstantValue(mockPrismaClient as any);

		container
			.bind<ProducerInstance>(TYPES.KafkaProducerServices)
			.toConstantValue(mockKafkaProducerServices as any);

		bookService = container.resolve<BookService>(BookService);
	});

	it('get() should return all books', async () => {
		const books = await bookService.get();

		expect(books).toEqual(
			mockBooks.map((book) => {
				return {
					title: book.title,
					image: book.image,
					quantity: book.quantity,
					price: book.price,
					description: book.description,
					author: book.author,
					category: book.categories,
				};
			})
		);
	});

	describe('#getById()', () => {
		it('should return correct book with id = 1', async () => {
			const id = 1;

			const book = await bookService.getById(id);

			expect(book).toEqual({
				id: 1,
				title: 'The Great Gatsby',
				image: 'https://example.com/great-gatsby.jpg',
				quantity: 15,
				price: 12,
				description:
					'The Great Gatsby is a novel written by American author F. Scott Fitzgerald.',
				author: 'F. Scott Fitzgerald',
				category: {
					id: 1,
					name: 'sport',
				},
			});
		});

		it('should throw NotFoundError due to not book has id = 2', async () => {
			const id = 2;
			bookId = id;

			try {
				await bookService.getById(id);
			} catch (error) {
				expect(error).rejects.toThrow('Not Found Item');
			}
		});
	});

	describe('#getByPaging()', () => {
		it('should return books', async () => {
			const query: BookQueryCriteria = {
				search: undefined,
				limit: 0,
				page: 0,
				sortOrder: ORDER.ASC,
				sortColumn: 'id',
				categoryId: undefined,
			};

			const books = await bookService.getByPaging(query);

			expect(books).toEqual({
				totalItems: 3,
				totalPages: 1,
				currentPage: 1,
				items: mockBooks.map((book) => {
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
			});
		});

		it('should return correct books with search filter', async () => {
			const query: BookQueryCriteria = {
				search: '1984',
				limit: 10,
				page: 1,
				sortOrder: ORDER.ASC,
				sortColumn: 'id',
				categoryId: undefined,
			};

			const filterBooks = mockBooks.filter((book) =>
				book.title.includes(query.search ?? '')
			);

      mockPrismaClient.books.findMany = jest.fn().mockResolvedValue(filterBooks);
      mockPrismaClient.books.count = jest.fn().mockReturnValue(filterBooks.length);

			const books = await bookService.getByPaging(query);

			expect(books).toEqual({
				totalItems: 1,
				totalPages: 1,
				currentPage: 1,
				items: filterBooks.map((book) => {
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
			});
		});

		it('should return correct books with categoryId filter', async () => {
			const query: BookQueryCriteria = {
				search: undefined,
				limit: 10,
				page: 1,
				sortOrder: ORDER.ASC,
				sortColumn: 'id',
				categoryId: 1,
			};

			const filterBooks = mockBooks.filter(
				(book) => book.categories.id === query.categoryId
			);

      mockPrismaClient.books.findMany = jest.fn().mockResolvedValue(filterBooks);
      mockPrismaClient.books.count = jest.fn().mockReturnValue(filterBooks.length);

			const books = await bookService.getByPaging(query);

			expect(books).toEqual({
				totalItems: 1,
				totalPages: 1,
				currentPage: 1,
				items: filterBooks.map((book) => {
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
			});
		});
	});

	describe('#createNewBook()', () => {
		it('should create new book successfully', async () => {
			const bookCreateDto = {
				title: 'New book',
				image: 'New book',
				quantity: 1,
				price: 1,
				description: 'New book description',
				author: 'author new book',
				categoryId: 1,
			};

			const createdBook = await bookService.createBook(bookCreateDto);

			expect(createdBook).toEqual({
				id: 4,
				title: 'New book',
				image: 'New book',
				quantity: 1,
				price: 1,
				description: 'New book description',
				author: 'author new book',
				category: {
					id: 1,
					name: 'sport',
				},
			});
		});

		it('should throw error due to not have category', async () => {
			categoryId = 2;
			const bookCreateDto = {
				title: 'New book',
				image: 'New book',
				quantity: 1,
				price: 1,
				description: 'New book description',
				author: 'author new book',
				categoryId: 2,
			};

			try {
				await bookService.createBook(bookCreateDto);
			} catch (error) {
				expect(error).rejects.toThrow('Not Found Item');
			}
		});
	});

	describe('#updateBook()', () => {
		it('should update book successfully', async () => {
			const id = 1;
			const bookUpdateDto = {
				title: 'Update book',
				image: 'Update book',
				quantity: 2,
				price: 2,
				description: 'Update book description',
				author: 'update author',
				categoryId: 1,
			};

			const updatedBook = await bookService.updateBook(id, bookUpdateDto);

			expect(updatedBook).toEqual({
				id: 1,
				title: 'Update book',
				image: 'Update book',
				quantity: 2,
				price: 2,
				description: 'Update book description',
				author: 'update author',
				category: {
					id: 1,
					name: 'sport',
				},
			});
		});

		it('should throw error due to not found book', async () => {
			bookId = 4;
			const id = 4;
			const bookUpdateDto = {
				title: 'Update book',
				image: 'Update book',
				quantity: 2,
				price: 2,
				description: 'Update book description',
				author: 'update author',
				categoryId: 1,
			};

			try {
				await bookService.updateBook(id, bookUpdateDto);
			} catch (error) {
				expect(error).rejects.toThrow('Not Found Item');
			}
		});

		it('should throw error due to not found category', async () => {
			categoryId = 4;
			const id = 4;
			const bookUpdateDto = {
				title: 'Update book',
				image: 'Update book',
				quantity: 2,
				price: 2,
				description: 'Update book description',
				author: 'update author',
				categoryId: 4,
			};

			try {
				await bookService.updateBook(id, bookUpdateDto);
			} catch (error) {
				expect(error).rejects.toThrow('Not Found Item');
			}
		});
	});

	describe('#deleteBook()', () => {
		it('should delete book successfully', async () => {
			const expectedId = 3;

			const filteredBook = mockBooks.find((book) => book.id === expectedId);
			mockPrismaClient.books.findUnique = jest.fn().mockResolvedValue(() => {
				return filteredBook;
			});
			mockPrismaClient.books.update = jest.fn().mockResolvedValue({
				...filteredBook,
				updated_date: new Date(),
				isDeleted: true,
			});
			const removedBook = await bookService.deleteBook(expectedId);

			expect(removedBook).toEqual(expectedId);
		});

		it('should throw error due to not found book', async () => {
			bookId = 4;
			const expectedId = 4;

			try {
				await bookService.deleteBook(expectedId);
			} catch (error) {
				expect(error).rejects.toThrow('Not Found Item');
			}
		});
	});
});
