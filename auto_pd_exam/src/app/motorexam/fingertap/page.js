'use client'
import WebcamStreamCapture from '../../components/WebcamStreamCapture';
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react';

function WebcamComponent() {
    const searchParams = useSearchParams();
    let whichHand = searchParams.get("whichHand");
    return (
        <div className='mt-20'>  
            <WebcamStreamCapture 
                task = {'Finger tapping evaluation'}
                message= {'Tap your pointer finger and thumb together for 10 seconds.'}
                nextPath = {'handmovement?whichHand=' + whichHand}
                hand = {whichHand}
                isLast = {false}
            />
        </div>
    )
}

export default function MotorExam() {
    return (
        <Suspense> 
            <WebcamComponent/>
        </Suspense>
    )
}