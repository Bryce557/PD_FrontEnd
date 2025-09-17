'use client'
import WebcamStreamCapture from '../../components/WebcamStreamCapture';
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react';

function WebcamComponent() {
    const searchParams = useSearchParams()
    let whichHand = searchParams.get("whichHand");
    let path = '/';
    let finished = true;
    if(whichHand === 'right') {
        path = 'fingertap?whichHand=left';
        finished = false;
    }
    return (
        <div className='mt-20'>
            <WebcamStreamCapture 
                task = {'Pronation/Supination evaluation'}
                message = {'Continously rotate palm up and down for 10 seconds.'}
                nextPath = {path}
                hand = {whichHand}
                isLast = {finished}
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