"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ParticlesBackground from "./components/ParticlesBackground";

export default function Home() {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");

  const texts = ["Hello I'm Mel Mathew", "This is my Portfolio"];
  
  const projects = [
    {
      title: "QCU AMS",
      description: "It allows staff to track assets, schedule maintenance, and manage inventory efficiently within the campus network. Each item is tagged with a QR code for quick identification, while role-based access ensures security and proper user permissions. The system also automates maintenance tracking and provides data insights to improve decision-making — ultimately reducing losses, saving time, and enhancing overall laboratory operations.",
      image: "/images/qcu-logo.png"
    },
    {
      title: "Vine Residence",
      description: "The Residence Management System is a digital platform designed to organize and manage dormitory or residence operations efficiently. It handles key tasks such as resident registration, room assignments, maintenance requests, and payment tracking.",
      image: "/images/Vine-Residences.png"
    },
    {
      title: "RFIDAMS",
      description: "RFIDAMS is an automated attendance monitoring system that uses RFID ID cards and a VB.NET application. When a student taps their RFID ID on the reader, the system instantly verifies their identity and records the time and date in the database. This provides fast, accurate, and paperless attendance tracking.",
      image: "/images/BG.png"
    }
  ];

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

  // Nav indicator + active link sync with sections
  useEffect(() => {
    const navContainer = document.querySelector('header nav .relative');
    if (!navContainer) return;
    const indicator = navContainer.querySelector('.nav-indicator') as HTMLElement | null;
    const links = Array.from(navContainer.querySelectorAll('a.nav-hover')) as HTMLAnchorElement[];

    function setIndicator(el: HTMLElement | null) {
      if (!indicator || !el) return;
      const rect = el.getBoundingClientRect();
      const parentRect = (navContainer as HTMLElement).getBoundingClientRect();
      indicator.style.left = `${rect.left - parentRect.left}px`;
      indicator.style.width = `${rect.width}px`;
      indicator.style.opacity = '1';
    }

    function clearActive() {
      links.forEach(l => l.classList.remove('nav-active'));
    }

    const clickHandlers: Array<{el: Element, handler: EventListener}> = [];
    links.forEach(link => {
      const handler = (e: Event) => {
        e.preventDefault();
        clearActive();
        link.classList.add('nav-active');
        setIndicator(link);
        const target = document.querySelector(link.getAttribute('href') || '');
        if (target) target.scrollIntoView({behavior: 'smooth', block: 'start'});
      };
      link.addEventListener('click', handler);
      clickHandlers.push({el: link, handler});
    });

    // Observe sections and set active when in view
    const sections = Array.from(document.querySelectorAll('section[id]')) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const active = links.find(l => l.getAttribute('href') === `#${id}`);
          if (active) {
            clearActive();
            active.classList.add('nav-active');
            setIndicator(active);
          }
        }
      });
    }, { threshold: 0.6 });
    sections.forEach(s => io.observe(s));

    // initialize
    const initial = links.find(l => l.getAttribute('href') === '#home') || links[0] || null;
    if (initial) {
      initial.classList.add('nav-active');
      setIndicator(initial as HTMLElement);
    }

    return () => {
      clickHandlers.forEach(({el, handler}) => el.removeEventListener('click', handler));
      io.disconnect();
    };
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

  // Slider drag/swipe handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const pos = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartPos(pos);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const currentPosition = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = currentPosition - startPos;
    setCurrentTranslate(prevTranslate + diff);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const movedBy = currentTranslate - prevTranslate;
    
    // Swipe threshold (50px)
    if (movedBy < -50 && currentSlide < projects.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (movedBy > 50 && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
    
    setCurrentTranslate(0);
    setPrevTranslate(0);
  };

  // Auto-play slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [projects.length]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    setFormMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus("success");
        setFormMessage("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setFormStatus("error");
        setFormMessage(data.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      setFormStatus("error");
      setFormMessage("An error occurred. Please try again later.");
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setFormStatus("idle");
      setFormMessage("");
    }, 5000);
  };

  return (
    <div className="grid-overlay">
      <ParticlesBackground />
      <div className="mx-auto max-w-[1200px] relative pointer-events-none" style={{ zIndex: 10 }}>
        <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(26,29,41,0.9)] backdrop-blur-xl border-b border-[rgba(0,217,255,0.2)] flex items-center justify-between gap-5 px-4 sm:px-8 md:px-14 py-4 md:py-5">
          <div className="font-bold text-[18px] sm:text-[20px] md:text-[22px] bg-gradient-to-r from-[#00d9ff] to-[#00ffcc] bg-clip-text" style={{WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Mathew</div>
          <nav className="flex gap-3 sm:gap-4 md:gap-6 items-center" aria-label="Main navigation">
            <div className="relative">
              <div className="flex gap-3 sm:gap-4 md:gap-6 items-center">
                <a className="text-white/80 rounded-md px-2 py-1 text-sm md:text-base shadow-inner text-neon-1 nav-hover" href="#home">Home</a>
                <a className="text-white/80 rounded-md px-2 py-1 text-sm md:text-base nav-hover" href="#about">About</a>
                <a className="text-white/80 rounded-md px-2 py-1 text-sm md:text-base nav-hover" href="#contact">Contact</a>
              </div>
              <span className="nav-indicator" aria-hidden="true"></span>
            </div>
          </nav>
        </header>

        <main>
          <section id="home" className="grid md:grid-cols-[1fr_440px] gap-6 md:gap-10 items-center min-h-screen px-4 sm:px-8 md:px-14 pt-20 md:pt-0">
            <div className="animate-on-scroll hero-left">
              <h1 className="animate-on-scroll text-[32px] sm:text-[40px] md:text-[56px] lg:text-[64px] leading-[1.05] font-extrabold text-white drop-shadow-[0_8px_40px_rgba(0,217,255,0.3)]">
                <span
                  className="bg-gradient-to-r from-[#00d9ff] via-[#00ffcc] to-[#00e5ff] bg-clip-text"
                  style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  {displayText}
                </span>
                <span className="typing-cursor">|</span>
              </h1>

              <div className="flex gap-2 mt-4 md:mt-5 flex-wrap animate-on-scroll delay-1">
                <span className="bg-[rgba(0,217,255,0.15)] px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm text-[#00ffcc] border border-[rgba(0,217,255,0.3)] hover:bg-[rgba(0,217,255,0.25)] hover:border-[#00d9ff] transition-all">PHP</span>
                <span className="bg-[rgba(0,217,255,0.15)] px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm text-[#00ffcc] border border-[rgba(0,217,255,0.3)] hover:bg-[rgba(0,217,255,0.25)] hover:border-[#00d9ff] transition-all">JavaScript</span>
                <span className="bg-[rgba(0,217,255,0.15)] px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm text-[#00ffcc] border border-[rgba(0,217,255,0.3)] hover:bg-[rgba(0,217,255,0.25)] hover:border-[#00d9ff] transition-all">HTML</span>
                <span className="bg-[rgba(0,217,255,0.15)] px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm text-[#00ffcc] border border-[rgba(0,217,255,0.3)] hover:bg-[rgba(0,217,255,0.25)] hover:border-[#00d9ff] transition-all">VB.NET</span>
                <span className="bg-[rgba(0,217,255,0.15)] px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm text-[#00ffcc] border border-[rgba(0,217,255,0.3)] hover:bg-[rgba(0,217,255,0.25)] hover:border-[#00d9ff] transition-all">Node.js</span>
                <span className="bg-[rgba(0,217,255,0.15)] px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm text-[#00ffcc] border border-[rgba(0,217,255,0.3)] hover:bg-[rgba(0,217,255,0.25)] hover:border-[#00d9ff] transition-all">CSS</span>
              </div>

              <div className="flex gap-3 md:gap-4 mt-5 md:mt-6 animate-on-scroll delay-2">
                <button className="rounded-lg md:rounded-xl px-4 py-2 md:px-6 md:py-3 text-sm md:text-base border border-white/6 text-white bg-transparent btn-hover">Projects</button>
                <button className="rounded-lg md:rounded-xl px-4 py-2 md:px-6 md:py-3 text-sm md:text-base border border-white/6 text-white bg-transparent btn-hover">Contact</button>
              </div>
            </div>

          </section>

          <section id="about" className="section">
            <div className="section-title animate-on-scroll">
              <h2><b>About Me</b></h2>
            </div>

            <div className="grid md:grid-cols-[1fr_300px] gap-6 md:gap-10 items-center">
              <div className="animate-on-scroll delay-1 order-2 md:order-1">
                <h3 className="m-0 text-[14px] md:text-[16px] font-semibold bg-gradient-to-r from-[#00d9ff] to-[#00ffcc] bg-clip-text" style={{WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Hello, I'm</h3>
                <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold m-0 mb-3 md:mb-4">Mel Mathew Perez Albason</h2>
                <p className="text-white/80 m-0 leading-[1.6] md:leading-[1.7] text-[14px] md:text-[16px]">
                  I am a BS Information Technology student at Quezon City University. I enjoy troubleshooting computers and typing or holding a keyboard and also fiddling with the parts of the computer. I'm here to pursue a challenging and creative career where I acquire new skills, and contribute effectively to the organization. 
                </p>

                <div className="flex gap-2 md:gap-3 mt-5 md:mt-6 animate-on-scroll delay-3">
                  <button className="rounded-lg md:rounded-xl px-4 py-2 md:px-5 text-sm md:text-base border border-white/6 text-white bg-transparent btn-hover">View Resume</button>
                  <button className="rounded-lg md:rounded-xl px-4 py-2 md:px-5 text-sm md:text-base border border-white/6 text-white bg-transparent btn-hover">View Projects</button>
                </div>
              </div>

              <div className="flex justify-center animate-on-scroll delay-2 order-1 md:order-2">
                <Image
                  src="/images/profile.png"
                  alt="Profile"
                  width={240}
                  height={240}
                  className="rounded-full border-[4px] border-white/6 object-cover w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] md:w-[240px] md:h-[240px]"
                />
              </div>
            </div>
          </section>

          <section id="journey" className="section">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
              <div className="bg-gradient-to-br from-[rgba(0,217,255,0.1)] to-[rgba(0,255,204,0.05)] p-4 md:p-6 rounded-xl md:rounded-2xl border border-[rgba(0,217,255,0.25)] animate-on-scroll backdrop-blur-sm hover:border-[#00d9ff] transition-all"><h3 className="m-0 text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#00d9ff] to-[#00ffcc] bg-clip-text" style={{WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>6</h3><p className="text-[#a0aec0] mt-1 md:mt-2 text-xs font-semibold tracking-wider">TOTAL PROJECTS</p></div>
              <div className="bg-gradient-to-br from-[rgba(0,217,255,0.1)] to-[rgba(0,255,204,0.05)] p-4 md:p-6 rounded-xl md:rounded-2xl border border-[rgba(0,217,255,0.25)] animate-on-scroll delay-1 backdrop-blur-sm hover:border-[#00d9ff] transition-all"><h3 className="m-0 text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#00d9ff] to-[#00ffcc] bg-clip-text" style={{WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>4</h3><p className="text-[#a0aec0] mt-1 md:mt-2 text-xs font-semibold tracking-wider">CERTIFICATES</p></div>
              <div className="bg-gradient-to-br from-[rgba(0,217,255,0.1)] to-[rgba(0,255,204,0.05)] p-4 md:p-6 rounded-xl md:rounded-2xl border border-[rgba(0,217,255,0.25)] animate-on-scroll delay-2 backdrop-blur-sm hover:border-[#00d9ff] transition-all"><h3 className="m-0 text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#00d9ff] to-[#00ffcc] bg-clip-text" style={{WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>9</h3><p className="text-[#a0aec0] mt-1 md:mt-2 text-xs font-semibold tracking-wider">TECH STACKS</p></div>
            </div>

            <div className="section-title animate-on-scroll delay-1">
              <h2><b>Educational Journey</b></h2>
              <p><i>A look into the studies and experiences that have honed my skills and shaped who I am today.</i></p>
            </div>

              <div className="grid gap-3 md:gap-4">
                <div className="bg-gradient-to-br from-[rgba(0,217,255,0.08)] to-[rgba(0,255,204,0.03)] p-4 md:p-6 rounded-xl md:rounded-2xl border border-[rgba(0,217,255,0.25)] animate-on-scroll delay-2 backdrop-blur-sm hover:border-[#00d9ff] transition-all">
                  <div className="flex items-center gap-3 md:gap-4">
                    <Image src="/images/qcu-logo.png" alt="QCU Logo" width={72} height={72} className="w-[56px] h-[56px] md:w-[72px] md:h-[72px] rounded-md object-contain bg-white p-1 border border-black/6 flex-shrink-0" />
                    <div>
                      <strong className="text-sm md:text-base">Quezon City University</strong>
                      <div className="text-white/60 text-xs md:text-sm mt-1">Bachelor of Science in Information Technology • 2022 - Present</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[rgba(0,217,255,0.08)] to-[rgba(0,255,204,0.03)] p-4 md:p-6 rounded-xl md:rounded-2xl border border-[rgba(0,217,255,0.25)] animate-on-scroll delay-3 backdrop-blur-sm hover:border-[#00d9ff] transition-all">
                  <div className="flex items-center gap-3 md:gap-4">
                    <Image src="/images/seaitt.png" alt="SEAITT Logo" width={72} height={72} className="w-[56px] h-[56px] md:w-[72px] md:h-[72px] rounded-md object-contain bg-white p-1 border border-black/6 flex-shrink-0" />
                    <div>
                      <strong className="text-sm md:text-base">South East Asia Institute of Trade And Technology</strong>
                      <div className="text-white/60 text-xs md:text-sm mt-1">Humanities and Social Sciences • 2019 - 2021</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[rgba(0,217,255,0.08)] to-[rgba(0,255,204,0.03)] p-4 md:p-6 rounded-xl md:rounded-2xl border border-[rgba(0,217,255,0.25)] animate-on-scroll delay-4 backdrop-blur-sm hover:border-[#00d9ff] transition-all">
                  <div className="flex items-center gap-3 md:gap-4">
                    <Image src="/images/b-silangan.png" alt="Bagong Silangan High School Logo" width={72} height={72} className="w-[56px] h-[56px] md:w-[72px] md:h-[72px] rounded-md object-contain bg-white p-1 border border-black/6 flex-shrink-0" />
                    <div>
                      <strong className="text-sm md:text-base">Bagong Silangan High School</strong>
                      <div className="text-white/60 text-xs md:text-sm mt-1">High School • 2014 - 2018</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[rgba(0,217,255,0.08)] to-[rgba(0,255,204,0.03)] p-4 md:p-6 rounded-xl md:rounded-2xl border border-[rgba(0,217,255,0.25)] animate-on-scroll delay-5 backdrop-blur-sm hover:border-[#00d9ff] transition-all">
                  <div className="flex items-center gap-3 md:gap-4">
                    <Image src="/images/b-e-silangan.png" alt="Bagong Silangan Elementary School Logo" width={72} height={72} className="w-[56px] h-[56px] md:w-[72px] md:h-[72px] rounded-md object-contain bg-white p-1 border border-black/6 flex-shrink-0" />
                    <div>
                      <strong className="text-sm md:text-base">Bagong Silangan Elementary School</strong>
                      <div className="text-white/60 text-xs md:text-sm mt-1">Elementary School • 2007 - 2013</div>
                    </div>
                  </div>
                </div>
              </div>
          </section>

          <section id="portfolio" className="section">
            <div className="section-title animate-on-scroll">
              <h2><b>Work Highlights</b></h2>
              <p><i>Explore key projects and accomplishments that demonstrate my skills, creativity, and technical proficiency.</i></p>
            </div>

            <div className="relative max-w-full sm:max-w-xl md:max-w-2xl mx-auto px-8 sm:px-10 md:px-0">
              <div className="overflow-hidden rounded-xl md:rounded-2xl">
                <div 
                  className="flex transition-transform duration-500 ease-out select-none"
                  style={{ 
                    transform: `translateX(calc(-${currentSlide * 100}% + ${currentTranslate}px))`,
                    cursor: isDragging ? 'grabbing' : 'grab'
                  }}
                  onMouseDown={handleDragStart}
                  onMouseMove={handleDragMove}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                  onTouchStart={handleDragStart}
                  onTouchMove={handleDragMove}
                  onTouchEnd={handleDragEnd}
                >
                  {projects.map((project, index) => (
                    <div key={index} className="min-w-full px-1 sm:px-2 md:px-4">
                      <div className="project animate-on-scroll">
                        <Image 
                          src={project.image} 
                          alt={project.title}
                          width={800}
                          height={400}
                          className="w-full h-[200px] xs:h-[220px] sm:h-[280px] md:h-[350px] lg:h-[400px] object-cover rounded-xl md:rounded-2xl border border-[rgba(0,217,255,0.3)] pointer-events-none"
                          draggable={false}
                        />
                        <h4 className="mt-2 sm:mt-3 text-base sm:text-lg md:text-xl font-bold">{project.title}</h4>
                        <p className="text-white/80 mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed">{project.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? projects.length - 1 : prev - 1))}
                className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-2 md:-translate-x-4 bg-gradient-to-r from-[#00d9ff] to-[#00ffcc] text-[#1a1d29] p-2 sm:p-2.5 md:p-3 rounded-full hover:shadow-lg hover:shadow-cyan-500/50 transition-all z-10 touch-manipulation"
                aria-label="Previous project"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <button
                onClick={() => setCurrentSlide((prev) => (prev === projects.length - 1 ? 0 : prev + 1))}
                className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-2 md:translate-x-4 bg-gradient-to-r from-[#00d9ff] to-[#00ffcc] text-[#1a1d29] p-2 sm:p-2.5 md:p-3 rounded-full hover:shadow-lg hover:shadow-cyan-500/50 transition-all z-10 touch-manipulation"
                aria-label="Next project"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-5 md:mt-6">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all touch-manipulation ${
                      currentSlide === index 
                        ? 'bg-gradient-to-r from-[#00d9ff] to-[#00ffcc] w-6 sm:w-8' 
                        : 'bg-white/30 hover:bg-white/50 w-1.5 sm:w-2'
                    }`}
                    aria-label={`Go to project ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          <section id="contact" className="section">
            <div className="section-title animate-on-scroll">
              <h2><b>Connect With Me</b></h2>
              <p><i>You can also connect with me through my social media channels.</i></p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="card animate-on-scroll delay-1">
                <h3 className="text-lg md:text-xl">Get in Touch</h3>
                <p className="muted text-sm md:text-base">Send me a Message.</p>
                <form onSubmit={handleSubmit} className="mt-3 md:mt-4">
                  <input 
                    className="input text-sm md:text-base" 
                    placeholder="Your Name" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <input 
                    className="input text-sm md:text-base" 
                    placeholder="Your Email" 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <textarea 
                    className="input text-sm md:text-base" 
                    rows={4} 
                    placeholder="Your Message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                  <button 
                    type="submit"
                    className="send-btn btn-hover text-sm md:text-base"
                    disabled={formStatus === "sending"}
                  >
                    {formStatus === "sending" ? "Sending..." : "Send Message"}
                  </button>
                  
                  {formMessage && (
                    <div className={`mt-4 p-3 rounded-lg text-sm ${
                      formStatus === "success" 
                        ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}>
                      {formMessage}
                    </div>
                  )}
                </form>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h3 className="text-lg md:text-xl mb-4"><b>Connect With Me</b></h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                    <a href="https://www.instagram.com/matiyeosczxc_/" target="_blank" rel="noopener noreferrer" className="pill cursor-pointer hover:scale-105 transition-transform text-center">Instagram</a>
                    <a href="https://www.facebook.com/mathewww12" target="_blank" rel="noopener noreferrer" className="pill cursor-pointer hover:scale-105 transition-transform text-center">Facebook</a>
                    <a href="https://github.com/letsfckntry" target="_blank" rel="noopener noreferrer" className="pill cursor-pointer hover:scale-105 transition-transform text-center">GitHub</a>
                    <a href="https://www.tiktok.com/@matchuxszxc_" target="_blank" rel="noopener noreferrer" className="pill cursor-pointer hover:scale-105 transition-transform text-center">TikTok</a>
                  </div>
                </div>
              </div>
              
              <div className="card animate-on-scroll delay-2" style={{display: 'none'}}>
                <h3 className="text-lg md:text-xl"><b>Connect With Me</b></h3>
                <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4">
                  <div className="pill">LinkedIn</div>
                  <a href="https://www.facebook.com/mathewww12" target="_blank" rel="noopener noreferrer" className="pill cursor-pointer hover:scale-105 transition-transform">Facebook</a>
                  <a href="https://github.com/letsfckntry" target="_blank" rel="noopener noreferrer" className="pill cursor-pointer hover:scale-105 transition-transform">GitHub</a>
                  <a href="https://www.tiktok.com/@matchuxszxc_" target="_blank" rel="noopener noreferrer" className="pill cursor-pointer hover:scale-105 transition-transform">TikTok</a>
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

