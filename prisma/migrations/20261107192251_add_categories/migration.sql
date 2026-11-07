-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_userId_name_key" ON "Category"("userId", "name");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: turn every distinct free-text category already used per user into a real Category row
INSERT INTO "Category" ("id", "userId", "name", "color", "createdAt")
SELECT
    gen_random_uuid()::text,
    distinct_categories."userId",
    distinct_categories."category",
    (ARRAY['#6d6af0','#34d399','#fb7185','#fbbf24','#38bdf8','#f472b6','#a78bfa','#2dd4bf'])[1 + (abs(hashtext(distinct_categories."category")) % 8)],
    now()
FROM (SELECT DISTINCT "userId", "category" FROM "Transaction") AS distinct_categories;

-- AlterTable: add categoryId (nullable for now)
ALTER TABLE "Transaction" ADD COLUMN "categoryId" TEXT;

-- Backfill categoryId on existing transactions from the new Category rows
UPDATE "Transaction" t
SET "categoryId" = c."id"
FROM "Category" c
WHERE c."userId" = t."userId" AND c."name" = t."category";

-- AlterTable: categoryId is now required
ALTER TABLE "Transaction" ALTER COLUMN "categoryId" SET NOT NULL;

-- AlterTable: drop the old free-text category column
ALTER TABLE "Transaction" DROP COLUMN "category";

-- CreateIndex
CREATE INDEX "Transaction_categoryId_idx" ON "Transaction"("categoryId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
