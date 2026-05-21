-- CreateTable
CREATE TABLE "Invitation" (
    "invitedUserId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "sentById" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("invitedUserId","organizationId")
);

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_invitedUserId_fkey" FOREIGN KEY ("invitedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_sentById_fkey" FOREIGN KEY ("sentById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
