-- CreateTable
CREATE TABLE "usd" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 10,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "isPay" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "usd_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usd_user_id_value_key" ON "usd"("user_id", "value");

-- AddForeignKey
ALTER TABLE "usd" ADD CONSTRAINT "usd_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
