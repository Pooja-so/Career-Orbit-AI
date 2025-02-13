"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full pt-32 md:pt-44 pb-10">
      <div className="space-y-6 text-center leading-tight">
        <div className="space-y-6 mx-auto">
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl xl:text-7xl gradient-title">
            Your AI Career Coach for <br />
            Professional Success
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl text-white ">
            Advance your career with personalized guidance, interview
            preparation, and AI-powered tools for job success.
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8 font-semibold text-lg">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="hero-image-wrapper mt-3 md:mt-0 py-8">
          {/* Through this imageRef we will be able to access this div element */}
          <div ref={imageRef} className="hero-image flex items-center justify-center">
            <Image
              src={"/banner-header.jpg"}
              width={900}
              height={500}
              alt="Banner"
              className="rounded-lg shadow-2xl border mx-auto"
              priority // priority so that image loads first
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
