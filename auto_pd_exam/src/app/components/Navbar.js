import NavLink from './Navlink';
import Image from 'next/image';
import { auth } from '../../../auth';

export default async function NavBar() {
    const session = await auth();
    console.log(session);
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
            <NavLink isLoggedIn={!!session}/> 
        </header>
   )
}

