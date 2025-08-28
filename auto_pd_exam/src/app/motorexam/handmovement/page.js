'use client'
import WebcamStreamCapture from '../../components/WebcamStreamCapture';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react';

function WebcamComponent() {
    const searchParams = useSearchParams()
    let whichHand = searchParams.get("whichHand");
    return (
        <div className='mt-20'>
            <WebcamStreamCapture 
                task = {'Hand movement evaluation'}
                message = {'Continously open and close fist for 10 seconds.'}
                nextPath = {'pronatesupinate?whichHand=' + whichHand}
                hand = {whichHand}
                isLast = {false}
            />
        </div>
    )
}


export default function MotorExam() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
            <NavBar></NavBar>
            <Suspense>
                <WebcamComponent></WebcamComponent>
            </Suspense>
            <Footer></Footer>
        </div>
    )
}