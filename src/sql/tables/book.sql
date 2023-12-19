CREATE TABLE Books (
    "id" int PRIMARY KEY,
    "name" text NOT NULL,
    "quantity" int NOT NULL DEFAULT 0,
    "price" int NOT NULL,
    "description" text,
    "author" text NOT NULL,
    "category_id" int NOT NULL,
    "image" text,
    "isDeleted" bit,
    
    CONSTRAINT FK_Category_Book FOREIGN KEY (category_id) REFERENCES Categories(id)
)