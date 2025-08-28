'use client'
import WebcamStreamCapture from '../../components/WebcamStreamCapture';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react';

export default function MotorExam() {
    const searchParams = useSearchParams()
    let whichHand = searchParams.get("whichHand");
    let path = '/';
    let finished = true;
    if(whichHand === 'right') {
        path = 'fingertap?whichHand=left';
        finished = false;
    }
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
            <NavBar></NavBar>
            <div className='mt-20'>
                <Suspense>
                    <WebcamStreamCapture 
                        task = {'Pronation/Supination evaluation'}
                        message = {'Continously rotate palm up and down for 10 seconds.'}
                        nextPath = {path}
                        hand = {whichHand}
                        isLast = {finished}
                    />
                </Suspense>
            </div>
            <Footer></Footer>
        </div>
    )
}