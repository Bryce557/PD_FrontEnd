import Link from 'next/link';
import {signOut} from '../../../auth';

export default function Navlink({isLoggedIn}) {
    return (
        <div className="flex items-center gap-6">
            <Link href='/' className="flex  mb-5 text-black/60"> 
                <p><strong>Home</strong></p>
            </Link>
            { !isLoggedIn ? (
                <Link 
                    href='/signin' 
                    className= "flex mb-5 text-black/60"
                > 
                    <p><strong>Login</strong></p>
                </Link>
            ) : (
                <form
                    action = {async () => {
                        'use server'
                        await signOut({redirectTo: '/'});
                    }}
                >
                    <button className= "flex mb-5 text-black/60">
                        <p><strong>Logout</strong></p>
                    </button>
                </form>
            )}
        </div>
    );
}