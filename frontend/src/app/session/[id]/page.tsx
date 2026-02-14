import SessionView from '@/components/SessionView';

export default async function SessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const initialTab = tab === 'chat' || tab === 'remix' || tab === 'voice' ? tab : undefined;
  return <SessionView sessionId={id} initialTab={initialTab} />;
}
