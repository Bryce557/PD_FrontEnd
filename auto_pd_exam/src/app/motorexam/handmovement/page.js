'use client'
import WebcamStreamCapture from '../../components/WebcamStreamCapture';
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
        <Suspense>
            <WebcamComponent></WebcamComponent>
        </Suspense>
    )
}