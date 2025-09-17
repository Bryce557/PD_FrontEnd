'use server'
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
 
export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
        <NavBar/>
        <main className="flex flex-col gap-[32px] row-start-2 mt-10">
          {children}
        </main>
        <Footer/>
    </div>
)}