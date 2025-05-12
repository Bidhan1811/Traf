"use client";

import Link from 'next/link';
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button';
import Image from 'next/image';

const HeroSection = () => {

    const imageRef = useRef(null);

    useEffect(() => {

        const imageElement = imageRef.current;
        if(!imageElement) return;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;

            if(scrollPosition>scrollThreshold){
                imageElement.classList.add("scrolled")
            } else {
                imageElement.classList.remove("scrolled")
            }
            
        }

        window.addEventListener("scroll",handleScroll)

        return () => window.removeEventListener("scroll",handleScroll)
    },[])

  return (
    <div className='pb-20 px-4 flex justify-center items-center pt-40'>
      <div className='container mx-auto text-center'>
        <h1 className='text-5xl md:text-8xl lg:text-[105px] pb-6 font-extrabold gradient-title'>
            Manage Your Finances <br /> with Intelligence
        </h1>
        <p className='text-xl mt-2 text-gray-400 mb-8 max-w-2xl mx-auto'>An AI-powered financial management platform that helps you track, analyze, and optimize your spending with real-time insights.
        </p>
        <div className='flex justify-center'>
            <Link href='/dashboard'>
            <Button size="lg" className="px-8 mb-3">Get Started</Button>
            </Link>
        </div>
        <div className='hero-image-wrapper'>
            <div ref={imageRef} className='hero-image'>
                <Image 
                src="/Banner.jpg" 
                height={720} 
                width={1200}
                alt="Hero Banner Image"
                className='rounded-lg shadow-2xl border mx-auto '/>
            </div>
        </div>
        </div>
    </div>
  )
}

export default HeroSection
