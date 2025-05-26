import React from 'react'
import Link from 'next/link'          // ✅ Fix 1
import Image from 'next/image'
import { Button } from './ui/button'

const HeroSection = () => {
  return (
    <section className="w-full pt-36 md:pt-48 pb-10">
      <div className='space-y-6 text-center'>
        <div className='space-y-6 mx-auto' >
          <h1 className='gradient-title'>
            Your AI Career Coach for
            <br />
            Professional Success
          </h1>
          <p>
            Advance Your Career With Personalized Guidance, Interview Prep,
            and AI-powered tools for job success.
          </p>
        </div>
        <div>
          <Link href="/dashboard">
            
            <Button size="lg" className="px-8" variant="outline">
                            get started
            </Button >

          </Link>
        </div>

        <div>
            <div>
                 <Image
            src="/banner.jpeg"
            width={1280}
            height={720}
            alt="sens_ai banner"
            className="rounded-lg shadow-2xl border mx-auto"
            priority
                />
          </div>
        </div>
      </div>
    </section>      
  )
}

export default HeroSection
