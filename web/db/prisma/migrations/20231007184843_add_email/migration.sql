-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(256) NOT NULL,
    "email" VARCHAR(256),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
