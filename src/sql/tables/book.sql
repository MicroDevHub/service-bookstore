CREATE TABLE Books (
    "id" SERIAL PRIMARY KEY ,
    "title" text NOT NULL,
    "quantity" int NOT NULL DEFAULT 0,
    "price" int NOT NULL,
    "description" text NOT NULL,
    "author" text NOT NULL,
    "category_id" int NOT NULL,
    "image" text NOT NULL,
    "created_date" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_date" timestamp,
    "isDeleted" boolean DEFAULT false,
    
    CONSTRAINT FK_Category_Book FOREIGN KEY (category_id) REFERENCES Categories(id)
)