import { ReactNode } from 'react';

export const runtime = 'nodejs';

export default function MemberLayout({
    children,
}: {
    children: ReactNode;
}) {
    return children;
}
