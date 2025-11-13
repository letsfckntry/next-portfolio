"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const texts = ["Hello I'm Mel Mathew", "This is my Portfolio"];

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
        }
      });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const currentText = texts[textIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentText.length) {
        // Typing
        setDisplayText(currentText.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        // Deleting
        setDisplayText(currentText.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === currentText.length) {
        // Pause before deleting
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex === 0) {
        // Move to next text
        setIsDeleting(false);
        setTextIndex((textIndex + 1) % texts.length);
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts]);

  return (
    <div className="grid-overlay">
      <div className="mx-auto max-w-[1200px] relative">
        <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(5,2,10,0.9)] backdrop-blur-md flex items-center justify-between gap-5 px-14 py-5">
          <div className="text-neon-2 font-bold text-[20px]">Mathew</div>
          <nav className="flex gap-6 items-center" aria-label="Main navigation">
            <a className="text-white/80 rounded-md px-2 py-1 shadow-inner text-neon-1" href="#home">Home</a>
            <a className="text-white/80 rounded-md px-2 py-1" href="#about">About</a>
            <a className="text-white/80 rounded-md px-2 py-1" href="#journey">Journey</a>
            <a className="text-white/80 rounded-md px-2 py-1" href="#portfolio">Portfolio</a>
            <a className="text-white/80 rounded-md px-2 py-1" href="#contact">Contact</a>
          </nav>
        </header>

        <main>
          <section id="home" className="grid md:grid-cols-[1fr_440px] gap-10 items-center min-h-screen px-14">
            <div className="animate-on-scroll hero-left">
              <h1 className="animate-on-scroll text-[40px] md:text-[64px] leading-[1.05] font-extrabold text-white drop-shadow-[0_6px_30px_rgba(139,92,246,0.08)]">
                <span
                  className="bg-gradient-to-r from-neon-2 to-[#6d28d9] bg-clip-text "
                  style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text', color: '#6d28d9' }}
                >
                  {displayText}
                </span>
                <span className="typing-cursor">|</span>
              </h1>

              <div className="flex gap-2 mt-5 flex-wrap animate-on-scroll delay-1">
                <span className="bg-white/5 px-3 py-1 rounded-full text-sm text-white/80 border border-white/5">PHP</span>
                <span className="bg-white/5 px-3 py-1 rounded-full text-sm text-white/80 border border-white/5">JavaScript</span>
                <span className="bg-white/5 px-3 py-1 rounded-full text-sm text-white/80 border border-white/5">HTML</span>
                <span className="bg-white/5 px-3 py-1 rounded-full text-sm text-white/80 border border-white/5">VB.NET</span>
                <span className="bg-white/5 px-3 py-1 rounded-full text-sm text-white/80 border border-white/5">Node.js</span>
                <span className="bg-white/5 px-3 py-1 rounded-full text-sm text-white/80 border border-white/5">CSS</span>
              </div>

              <div className="flex gap-4 mt-6 animate-on-scroll delay-2">
                <button className="rounded-xl px-6 py-3 border border-white/6 text-white bg-transparent">Projects</button>
                <button className="rounded-xl px-6 py-3 border border-white/6 text-white bg-transparent">Contact</button>
              </div>
            </div>

          </section>

          <section id="about" className="section">
            <div className="section-title animate-on-scroll">
              <h2>About Me</h2>
            </div>

            <div className="grid md:grid-cols-[1fr_300px] gap-10 items-center">
              <div className="animate-on-scroll delay-1">
                <h3 className="text-neon-2 m-0 text-[16px]">Hello, I'm</h3>
                <h2 className="text-[32px] font-bold m-0 mb-4">Mel Mathew Perez Albason</h2>
                <p className="text-white/80 m-0 leading-[1.7] text-[16px]">
                  I am a BS Information Technology student at Quezon City University. I enjoy troubleshooting computers and typing or holding a keyboard and also fiddling with the parts of the computer. I'm here to pursue a challenging and creative career where I acquire new skills, and contribute effectively to the organization. 
                </p>

                <div className="flex gap-3 mt-6 animate-on-scroll delay-3">
                  <button className="rounded-xl px-5 py-2 border border-white/6 text-white bg-transparent">View Resume</button>
                  <button className="rounded-xl px-5 py-2 border border-white/6 text-white bg-transparent">View Projects</button>
                </div>
              </div>

              <div className="flex justify-center animate-on-scroll delay-2">
                <Image
                  src="/images/profile.png"
                  alt="Profile"
                  width={240}
                  height={240}
                  className="rounded-full border-[4px] border-white/6 object-cover"
                />
              </div>
            </div>
          </section>

          <section id="journey" className="section">
            <div className="flex gap-4 justify-between mb-10">
              <div className="bg-gradient-to-b from-white/2 to-white/1 p-6 rounded-xl border border-white/5 flex-1 animate-on-scroll"><h3 className="m-0 text-2xl">6</h3><p className="text-white/60 mt-1 text-xs font-semibold">TOTAL PROJECTS</p></div>
              <div className="bg-gradient-to-b from-white/2 to-white/1 p-6 rounded-xl border border-white/5 flex-1 animate-on-scroll delay-1"><h3 className="m-0 text-2xl">4</h3><p className="text-white/60 mt-1 text-xs font-semibold">CERTIFICATES</p></div>
              <div className="bg-gradient-to-b from-white/2 to-white/1 p-6 rounded-xl border border-white/5 flex-1 animate-on-scroll delay-2"><h3 className="m-0 text-2xl">9</h3><p className="text-white/60 mt-1 text-xs font-semibold">TECH STACKS</p></div>
            </div>

            <div className="section-title animate-on-scroll delay-1">
              <h2>Educational Journey</h2>
              <p><i>A look into the studies and experiences that have honed my skills and shaped who I am today.</i></p>
            </div>

              <div className="grid gap-4">
                <div className="bg-gradient-to-b from-white/2 to-white/1 p-6 rounded-xl border border-white/5 animate-on-scroll delay-2">
                  <div className="flex items-center gap-4">
                    <Image src="/images/qcu-logo.png" alt="QCU Logo" width={72} height={72} className="w-[72px] h-[72px] rounded-md object-contain bg-white p-1 border border-black/6" />
                    <div>
                      <strong>Quezon City University</strong>
                      <div className="text-white/60">Bachelor of Science in Information Technology • 2022 - Present</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-b from-white/2 to-white/1 p-6 rounded-xl border border-white/5 animate-on-scroll delay-3">
                  <div className="flex items-center gap-4">
                    <Image src="/images/seaitt.png" alt="SEAITT Logo" width={72} height={72} className="w-[72px] h-[72px] rounded-md object-contain bg-white p-1 border border-black/6" />
                    <div>
                      <strong>South East Asia Institute of Trade And Technology</strong>
                      <div className="text-white/60">Humanities and Social Sciences • 2019 - 2021</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-b from-white/2 to-white/1 p-6 rounded-xl border border-white/5 animate-on-scroll delay-4">
                  <div className="flex items-center gap-4">
                    <Image src="/images/b-silangan.png" alt="Bagong Silangan High School Logo" width={72} height={72} className="w-[72px] h-[72px] rounded-md object-contain bg-white p-1 border border-black/6" />
                    <div>
                      <strong>Bagong Silangan High School</strong>
                      <div className="text-white/60">High School • 2014 - 2018</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-b from-white/2 to-white/1 p-6 rounded-xl border border-white/5 animate-on-scroll delay-5">
                  <div className="flex items-center gap-4">
                    <Image src="/images/b-e-silangan.png" alt="Bagong Silangan Elementary School Logo" width={72} height={72} className="w-[72px] h-[72px] rounded-md object-contain bg-white p-1 border border-black/6" />
                    <div>
                      <strong>Bagong Silangan Elementary School</strong>
                      <div className="text-white/60">Elementary School • 2007 - 2013</div>
                    </div>
                  </div>
                </div>
              </div>
          </section>

          <section id="portfolio" className="section">
            <div className="section-title animate-on-scroll">
              <h2>Work Highlights</h2>
              <p><i>Explore key projects and accomplishments that demonstrate my skills, creativity, and technical proficiency.</i></p>
            </div>

            <div className="grid">
              <div className="project animate-on-scroll delay-1">
                <div style={{height:160,background:'#2b2350',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700}}>Project Image</div>
                <h4>QCU AMS</h4>
                <p>It allows staff to track assets, schedule maintenance, and manage inventory efficiently within the campus network. Each item is tagged with a QR code for quick identification, while role-based access ensures security and proper user permissions. The system also automates maintenance tracking and provides data insights to improve decision-making — ultimately reducing losses, saving time, and enhancing overall laboratory operations.</p>
              </div>

              <div className="project animate-on-scroll delay-2">
                <div style={{height:160,background:'#2b2350',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700}}>Project Image</div>
                <h4>Vine Residence</h4>
                <p>The Residence Management System is a digital platform designed to organize and manage dormitory or residence operations efficiently. It handles key tasks such as resident registration, room assignments, maintenance requests, and payment tracking.</p>
              </div>
            </div>
          </section>

          <section id="contact" className="section">
            <div className="section-title animate-on-scroll">
              <h2>Contact Me</h2>
              <p>Got a question? Send me a message or connect with me through social media.</p>
            </div>

            <div className="contact-wrap">
              <div className="card animate-on-scroll delay-1">
                <h3>Get in Touch</h3>
                <p className="muted">Have something to discuss? Send me a message and let's talk.</p>
                <div style={{marginTop:14}}>
                  <input className="input" placeholder="Your Name" />
                  <input className="input" placeholder="Your Email" />
                  <textarea className="input" rows={6} placeholder="Your Message" />
                  <button className="send-btn">✈️ Send Message</button>
                </div>
              </div>

              <div className="card animate-on-scroll delay-2">
                <h3>Connect With Me</h3>
                <p className="muted">You can also connect with me through my social media channels.</p>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:16}}>
                  <div className="pill">LinkedIn</div>
                  <div className="pill">Instagram</div>
                  <div className="pill">Github</div>
                  <div className="pill">Tiktok</div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer style={{textAlign:'center',padding:'28px 0',color:'rgba(255,255,255,0.55)'}}>© 2025 Mel Mathew Perez Albason</footer>
      </div>
    </div>
  );
}
