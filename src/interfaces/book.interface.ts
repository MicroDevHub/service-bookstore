import { BookCreateUpdateDto, BookModel, BookQueryCriteria } from '../models/book.model';
import { PagedResponseModel  } from '../models/pagination-model/paged-response-model';

export interface IBookService {
	get(): Promise<BookModel[]>;
	getById(id: number): Promise<BookModel>;
	getByPaging(
		query: BookQueryCriteria
	): Promise<PagedResponseModel<BookModel>>;
	createBook(bookCreateDto: BookCreateUpdateDto): Promise<BookModel>;
	updateBook(
		id: number,
		bookUpdateDto: BookCreateUpdateDto
	): Promise<BookModel>;
    deleteBook(id: number): Promise<number>;
}