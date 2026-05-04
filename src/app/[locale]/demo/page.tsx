import { DemoClient } from './DemoClient'

export default async function DemoPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <DemoClient locale={locale} />
}
