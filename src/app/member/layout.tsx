import { ReactNode } from 'react';

export const runtime = 'edge';

export default function MemberLayout({
    children,
}: {
    children: ReactNode;
}) {
    return children;
}
