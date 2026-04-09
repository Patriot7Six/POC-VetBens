import { Nav }    from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-navy-950">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
