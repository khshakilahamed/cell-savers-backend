/*
  Warnings:

  - A unique constraint covering the columns `[contact_no]` on the table `admins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contact_no]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contact_no]` on the table `super_admins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contact_no]` on the table `technicians` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "admins_contact_no_key" ON "admins"("contact_no");

-- CreateIndex
CREATE UNIQUE INDEX "customers_contact_no_key" ON "customers"("contact_no");

-- CreateIndex
CREATE UNIQUE INDEX "super_admins_contact_no_key" ON "super_admins"("contact_no");

-- CreateIndex
CREATE UNIQUE INDEX "technicians_contact_no_key" ON "technicians"("contact_no");
