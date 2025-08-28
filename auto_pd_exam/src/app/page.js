'use client';
import Image from "next/image";
import WebcamStreamCapture from './components/WebcamStreamCapture';
import Link from 'next/link';
import NavBar from './components/Navbar';
import Footer from './components/Footer';
import WelcomePage from "./components/WelcomePage";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      <NavBar></NavBar>
      <main className="flex flex-col gap-[32px] row-start-2 mt-10">
        <WelcomePage></WelcomePage>
      </main>
      <Footer></Footer>
    </div>
  );
}
