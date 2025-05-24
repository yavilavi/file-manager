-- AddForeignKey
ALTER TABLE "credit_transaction" ADD CONSTRAINT "credit_transaction_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "company"("tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;
