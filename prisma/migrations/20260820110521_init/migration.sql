-- CreateEnum
CREATE TYPE "PaidTo" AS ENUM ('FRANCISCA', 'EDVALDO');

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "paidTo" "PaidTo" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Payment_paidTo_idx" ON "Payment"("paidTo");

-- CreateIndex
CREATE INDEX "Payment_age_idx" ON "Payment"("age");
