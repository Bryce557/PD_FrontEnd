import SignIn from '../components/SignIn';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SignInPage() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
            <NavBar></NavBar>
            <div className='row-start-2 fade-in'>
                <SignIn></SignIn>
            </div>
            <Footer></Footer>
        </div>
    )
}