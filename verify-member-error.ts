import { prisma } from "./src/lib/prisma";
import { getMemberByMemberId } from "./src/app/actions/member-portal";

async function verifyMemberError() {
    console.log("Testing getMemberByMemberId with 'cust101'...");

    // Ensure test data exists
    const existing = await prisma.member.findFirst({ where: { memberId: "cust101" } });
    if (!existing) {
        await prisma.member.create({
            data: { memberId: "cust101", name: "Error Test User" }
        });
    }

    try {
        const result = await getMemberByMemberId("cust101");
        console.log("Result:", result);
    } catch (e) {
        console.error("CAUGHT EXTERNAL ERROR:", e);
    }
}

verifyMemberError()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
