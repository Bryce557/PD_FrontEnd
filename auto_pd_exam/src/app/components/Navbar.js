'use client'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function NavBar() {
   let pathname = usePathname();
   return (
        <header className="row-start-1 bg-white/30 h-25 w-full flex flex-row items-end justify-between pl-8 pr-8">
            <div className="flex items-center">
                <Image 
                src="/logo.png" 
                alt="Logo" 
                width={60} 
                height={60} 
                className="object-contain"
                />
                <span className="text-black font-bold">SymCap</span>
            </div>
            <div className="flex items-center gap-6">
            <Link href='/' className={`flex  mb-5 ${pathname==='/' ? 'text-gray-600/60' : 'text-black/60'}`}> <p><strong>Home</strong></p></Link>
            <Link href='/signin' className={`flex mb-5 ${pathname==='/signin' ? 'text-gray-600/60' : 'text-black/60'}`}> <p><strong>Sign in</strong></p></Link>
            </div>
        </header>
   )
}