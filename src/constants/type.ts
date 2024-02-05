const TYPES = {
  IBookService: Symbol('IBookService'),
  ICategoryService: Symbol('ICategoryService'),
  ILogger: Symbol('ILogger'),
  ILoggerFactory: Symbol('ILoggerFactory'),
  PrismaClient: Symbol('PrismaClient'),
  DatabaseServices: Symbol('DatabaseServices'),
  KafkaProducerServices: Symbol('ProducerInstance'),
};

export default TYPES;
