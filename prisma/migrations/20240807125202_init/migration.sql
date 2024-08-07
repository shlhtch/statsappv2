-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TEAMLEAD', 'MANAGER');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "isAuth" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "telegramId" TEXT NOT NULL,
    "teamId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "role" "Role" NOT NULL DEFAULT 'MANAGER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stats" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "user_id" INTEGER NOT NULL,
    "deposits" INTEGER NOT NULL DEFAULT 0,
    "redeposits" INTEGER NOT NULL DEFAULT 0,
    "tir1" INTEGER NOT NULL DEFAULT 0,
    "tir2" INTEGER DEFAULT 0,
    "comment" TEXT,
    "firstvalue" INTEGER DEFAULT 0,
    "secondvalue" INTEGER DEFAULT 0,
    "thirdvalue" INTEGER DEFAULT 0,
    "fourthvalue" INTEGER DEFAULT 0,
    "fifthvalue" INTEGER DEFAULT 0,
    "firtsminus" INTEGER DEFAULT 0,
    "secondminus" INTEGER DEFAULT 0,
    "thirdminus" INTEGER DEFAULT 0,
    "totals" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegramId_key" ON "users"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "teams_title_key" ON "teams"("title");

-- CreateIndex
CREATE UNIQUE INDEX "stats_user_id_date_key" ON "stats"("user_id", "date");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stats" ADD CONSTRAINT "stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
