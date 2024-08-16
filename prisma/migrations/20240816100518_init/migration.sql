/*
  Warnings:

  - A unique constraint covering the columns `[user_id,value]` on the table `usd` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "usd_user_id_value_key" ON "usd"("user_id", "value");
