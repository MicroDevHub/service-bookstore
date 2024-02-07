import "reflect-metadata";
import { Container } from "inversify";
import { BookController } from "../../../controllers";
import TYPES from "../../../constants/type";
import { ILogger } from "@hh-bookstore/common";
import { Request, Response } from 'express'
import { IBookService } from "../../../interfaces";
import { ORDER } from "../../../constants/sort-order.enum";

const mockGetBooks = [
	{
		title: 'The Great Gatsby',
		image: 'https://example.com/great-gatsby.jpg',
		quantity: 15,
		price: 12,
		description: 'The Great Gatsby is a novel written by American author F. Scott Fitzgerald.',
		author: 'F. Scott Fitzgerald',
		category: {
			id: 1,
			name: 'sport',
		},
	},
	{
		title: 'To Kill a Mockingbird',
		image: 'https://example.com/to-kill-a-mockingbird.jpg',
		quantity: 20,
		price: 10,
		description: 'To Kill a Mockingbird is a novel by Harper Lee published in 1960.',
		author: 'Harper Lee',
		category: {
			id: 2,
			name: 'drama',
		},
	},
	{
		title: '1984',
		image: 'https://example.com/1984.jpg',
		quantity: 12,
		price: 14,
		description: '1984 is a dystopian social science fiction novel by George Orwell.',
		author: 'George Orwell',
		category: {
			id: 3,
			name: 'comedy',
		},
	},
];

describe('BookController', () => {
  let container: Container;
  let bookController: BookController;

  const mockLogger = {
    info: jest.fn(),
    error: jest.fn()
  }

  const mockBookServices = {
    get: jest.fn().mockResolvedValue(mockGetBooks),
    getById: jest.fn().mockResolvedValue(mockGetBooks[0]),
    getByPaging: jest.fn().mockResolvedValue(mockGetBooks),
    createBook: jest.fn().mockResolvedValue({
      id: 4,
      title: 'New book',
      image: 'New book',
      quantity: 1,
      price: 1,
      description: 'New book description',
      author: 'author new book',
      categoryId: 1,
    }),
    updateBook: jest.fn().mockResolvedValue({
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
    }),
    deleteBook: jest.fn().mockResolvedValue({ id: 1 }),
  }

  beforeEach(() => {
    container = new Container();

    container.bind<ILogger>(TYPES.ILogger).toConstantValue(mockLogger as any);

    container.bind<IBookService>(TYPES.IBookService).toConstantValue(mockBookServices as any);

    bookController = container.resolve<BookController>(BookController);
  });


  it('getBooks should return all books', async() => {
    const mReq: Partial<Request> = {}
    const mRes: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    const next = jest.fn();

    await bookController.getBooks(mReq as Request, mRes as Response, next)

    expect(mockLogger.info).toHaveBeenCalled();
    expect(mRes.status).toHaveBeenCalledWith(200);
    expect(mRes.json).toHaveBeenCalledWith(mockGetBooks);
  })

  describe('getBookByPagination', () => {
    it('getBookByPagination should return books', async() => {
      const mReq: Partial<Request> = {
        query: {
          search: undefined,
          limit: '0',
          page: '0',
          sortOrder: undefined,
          sortColumn: undefined,
          categoryId: undefined
        }
      }
      const mRes: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      }
      const next = jest.fn();
  
      await bookController.getBookByPagination(mReq as Request, mRes as Response, next)
  
      expect(mockLogger.info).toHaveBeenCalled();
      expect(mRes.status).toHaveBeenCalledWith(200);
      expect(mRes.json).toHaveBeenCalledWith(mockGetBooks);
    })

    it('getBookByPagination should return books by filter', async() => {
      mockBookServices.getByPaging = jest.fn().mockResolvedValue({
        title: '1984',
        image: 'https://example.com/1984.jpg',
        quantity: 12,
        price: 14,
        description: '1984 is a dystopian social science fiction novel by George Orwell.',
        author: 'George Orwell',
        category: {
          id: 3,
          name: 'comedy',
        },
      })

      const mReq: Partial<Request> = {
        query: {
          search: '1984',
          limit: '10',
          page: '1',
          sortOrder: ORDER.ASC,
          sortColumn: 'id',
          categoryId: undefined,
        }
      }
      const mRes: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      }
      const next = jest.fn();
  
      await bookController.getBookByPagination(mReq as Request, mRes as Response, next)
  
      expect(mockLogger.info).toHaveBeenCalled();
      expect(mRes.status).toHaveBeenCalledWith(200);
      expect(mRes.json).toHaveBeenCalledWith({
        title: '1984',
        image: 'https://example.com/1984.jpg',
        quantity: 12,
        price: 14,
        description: '1984 is a dystopian social science fiction novel by George Orwell.',
        author: 'George Orwell',
        category: {
          id: 3,
          name: 'comedy',
        }
      });
    })
  })

  it('getById should return correct book with id = 1', async() => {
    const mReq: Partial<Request> = {
      params: {
        id: '1'
      }
    }
    const mRes: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    const next = jest.fn();

    await bookController.getById(mReq as Request, mRes as Response, next)

    expect(mockLogger.info).toHaveBeenCalled();
    expect(mRes.status).toHaveBeenCalledWith(200);
    expect(mRes.json).toHaveBeenCalledWith(mockGetBooks[0]);
  })

  it('getById should catch error due to not found book', async() => {
    mockBookServices.getById = jest.fn().mockRejectedValue({})
    const mReq: Partial<Request> = {
      params: {
        id: '4'
      }
    }
    const mRes: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    const next = jest.fn();

    await bookController.getById(mReq as Request, mRes as Response, next)

    expect(next).toHaveBeenCalled();
  })

  it('createBook() should return new book', async() => {
    const mReq: Partial<Request> = {
      body: {
        title: 'New book',
        image: 'New book',
        quantity: 1,
        price: 1,
        description: 'New book description',
        author: 'author new book',
        categoryId: 1,
      }
    }
    const mRes: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    const next = jest.fn();

    await bookController.createBook(mReq as Request, mRes as Response, next)

    expect(mockLogger.info).toHaveBeenCalled();
    expect(mRes.status).toHaveBeenCalledWith(200);
    expect(mRes.json).toHaveBeenCalledWith({
      id: 4,
      title: 'New book',
      image: 'New book',
      quantity: 1,
      price: 1,
      description: 'New book description',
      author: 'author new book',
      categoryId: 1,
    });
  })

  it('updateBook() should return updated book', async() => {
    const mReq: Partial<Request> = {
      params: { id: '1' },
      body: {
        title: 'Update book',
        image: 'Update book',
        quantity: 2,
        price: 2,
        description: 'Update book description',
        author: 'update author',
        categoryId: 1,
      }
    }
    const mRes: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    const next = jest.fn();

    await bookController.updateBook(mReq as Request, mRes as Response, next)

    expect(mockLogger.info).toHaveBeenCalled();
    expect(mRes.status).toHaveBeenCalledWith(200);
    expect(mRes.json).toHaveBeenCalledWith({
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
  })

  it('deleteBook() should return id of deleted book', async() => {
    const mReq: Partial<Request> = {
      params: { id: '1' },
    }
    const mRes: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    const next = jest.fn();

    await bookController.deleteBook(mReq as Request, mRes as Response, next)

    expect(mockLogger.info).toHaveBeenCalled();
    expect(mRes.status).toHaveBeenCalledWith(200);
    expect(mRes.json).toHaveBeenCalledWith(
      { message: 'Remove book successfully' }
    );
  })

  it('deleteBook should catch error due to not found book', async() => {
    mockBookServices.deleteBook = jest.fn().mockRejectedValue({})
    
    container.rebind<IBookService>(TYPES.IBookService).toConstantValue(mockBookServices as any);

    bookController = container.resolve<BookController>(BookController);
    
    const mReq: Partial<Request> = {
      params: {
        id: '4'
      }
    }
    const mRes: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    const next = jest.fn();

    await bookController.deleteBook(mReq as Request, mRes as Response, next)

    expect(mockLogger.error).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  })
})