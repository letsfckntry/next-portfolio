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
      <div className="site-wrap">
        <header className="top-nav">
          <div className="brand">Mathew</div>
          <nav className="nav-links" aria-label="Main navigation">
            <a className="active" href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#journey">Journey</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <main>
          <section id="home" className="hero">
            <div className="hero-left">
             
              <h1 className="animate-on-scroll">
                <span className="accent">{displayText}</span>
                <span className="typing-cursor">|</span>
              </h1>

              <div className="pills animate-on-scroll delay-1">
                <span className="pill">React</span>
                <span className="pill">JavaScript</span>
                <span className="pill">Tailwind CSS</span>
                <span className="pill">Bootstrap</span>
              </div>

              <div className="cta-row animate-on-scroll delay-2">
                <button className="btn btn-primary">Projects</button>
                <button className="btn btn-outline">Contact</button>
              </div>
            </div>

          
          </section>

          <section id="about" className="section">
            <div className="section-title animate-on-scroll">
              <h2>About Me</h2>
              <p>Transforming caffeine into digital experiences.</p>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:40,alignItems:'center'}}>
              <div className="animate-on-scroll delay-1">
                <h3 style={{color:'var(--neon-2)',margin:'0 0 4px 0',fontSize:16}}>Hello, I'm</h3>
                <h2 style={{fontSize:32,margin:'0 0 16px 0',fontWeight:700}}>Mel Mathew Perez Albason</h2>
                <p className="muted" style={{margin:0,lineHeight:1.7,fontSize:16}}>
                  A 21-year-old BSIT student from the Philippines, currently a Frontend Developer aiming to become a Software Engineer. My goal is to create effective digital experiences using current technologies and to learn new industry standards quickly.
                </p>

                <div style={{display:'flex',gap:12,marginTop:24}} className="animate-on-scroll delay-3">
                  <button className="btn btn-primary">View Resume</button>
                  <button className="btn btn-outline">View Projects</button>
                </div>
              </div>

              <div style={{display:'flex',justifyContent:'center'}} className="animate-on-scroll delay-2">
                <Image
                  src="/images/profile.png"
                  alt="Profile"
                  width={240}
                  height={240}
                  style={{borderRadius: '50%', border: '4px solid rgba(255,255,255,0.06)'}}
                />
              </div>
            </div>
          </section>

          <section id="journey" className="section">
            <div className="stats">
              <div className="stat-card animate-on-scroll"><h3>4</h3><p>TOTAL PROJECTS</p></div>
              <div className="stat-card animate-on-scroll delay-1"><h3>2</h3><p>CERTIFICATES</p></div>
              <div className="stat-card animate-on-scroll delay-2"><h3>12</h3><p>TECH STACKS</p></div>
            </div>

            <div className="section-title animate-on-scroll delay-1">
              <h2>My Journey</h2>
              <p>Explore my academic and professional journey that has shaped my skills and expertise.</p>
            </div>

            <div style={{display:'grid',gap:16}}>
              <div className="card animate-on-scroll delay-2">
                <strong>Quezon City University</strong>
                <div className="muted">Bachelor of Science in Information Technology • 2022 - Present</div>
              </div>
              <div className="card animate-on-scroll delay-3">
                <strong>Immaculada Concepcion College</strong>
                <div className="muted">Information and Communications Technology • 2020 - 2022</div>
              </div>
            </div>
          </section>

          <section id="portfolio" className="section">
            <div className="section-title animate-on-scroll">
              <h2>Portfolio Showcase</h2>
              <p>Explore my journey through projects, certifications, and technical expertise.</p>
            </div>

            <div className="grid">
              <div className="project animate-on-scroll delay-1">
                <div style={{height:160,background:'#2b2350',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700}}>Project Image</div>
                <h4>LazyStack</h4>
                <p>LazyStack is a modern web platform showcasing a curated collection of developer tools, focusing on AI-powered development solutions.</p>
              </div>

              <div className="project animate-on-scroll delay-2">
                <div style={{height:160,background:'#2b2350',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700}}>Project Image</div>
                <h4>Weather Grid</h4>
                <p>Weather Grid provides reliable, up-to-date weather information through a clean, easy-to-use interface.</p>
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
