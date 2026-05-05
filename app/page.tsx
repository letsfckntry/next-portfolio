"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ParticlesBackground from "./components/ParticlesBackground";
// import TicTacToe from "./components/TicTacToe";

export default function Home() {
  const [nameText, setNameText] = useState("");
  const [descText, setDescText] = useState("");
  const [addressText, setAddressText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [websiteText, setWebsiteText] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const [showCertificates, setShowCertificates] = useState(false);
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");

  const fullName = "MEL MATHEW ALBASON";
  const fullDesc = "BS Information Technology student at Quezon City University. Passionate about web development, troubleshooting, and creating innovative solutions.";
  const fullAddress = "Quezon City, Philippines";
  const fullEmail = "melmathewzxc12@gmail.com";
  const fullWebsite = "www.melmathew.dev";

  // Certificate images - add your certificate image paths here
  const certificates = [
    "/images/cybersecurity.png",
    "/images/ethical.png",
    "/images/ignite.png",
    "/images/maralabs.png",
    "/images/tech.png"
  
  ];
  
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

  // Typing animation for name
  useEffect(() => {
    if (nameText.length < fullName.length) {
      const timeout = setTimeout(() => {
        setNameText(fullName.slice(0, nameText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [nameText]);

  // Typing animation for description (starts after name is complete)
  useEffect(() => {
    if (nameText === fullName && descText.length < fullDesc.length) {
      const timeout = setTimeout(() => {
        setDescText(fullDesc.slice(0, descText.length + 1));
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [nameText, descText]);

  // Typing animation for address (starts after description is complete)
  useEffect(() => {
    if (descText === fullDesc && addressText.length < fullAddress.length) {
      const timeout = setTimeout(() => {
        setAddressText(fullAddress.slice(0, addressText.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [descText, addressText]);

  // Typing animation for email (starts after address is complete)
  useEffect(() => {
    if (addressText === fullAddress && emailText.length < fullEmail.length) {
      const timeout = setTimeout(() => {
        setEmailText(fullEmail.slice(0, emailText.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [addressText, emailText]);

  // Typing animation for website (starts after email is complete)
  useEffect(() => {
    if (emailText === fullEmail && websiteText.length < fullWebsite.length) {
      const timeout = setTimeout(() => {
        setWebsiteText(fullWebsite.slice(0, websiteText.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [emailText, websiteText]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add 'animated' class to trigger the animation
          entry.target.classList.add('animated');
        } else {
          // Remove 'animated' class when element leaves viewport
          entry.target.classList.remove('animated');
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
      <div className="mx-auto max-w-[1200px] relative" style={{ zIndex: 10, pointerEvents: 'auto' }}>
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a] border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between gap-5 px-4 md:px-8 lg:px-20 py-4 md:py-6">
          <div className="font-bold text-[16px] md:text-[20px] lg:text-[24px] text-white tracking-[2px] md:tracking-[4px]">MEL MATHEW</div>
          <nav className="flex gap-3 sm:gap-6 md:gap-8 lg:gap-12 items-center text-[10px] sm:text-[12px] md:text-[14px]" aria-label="Main navigation">
            <a className="vector-nav-link nav-hover" href="#home">HOME</a>
            <a className="vector-nav-link nav-hover" href="#about">ABOUT</a>
            <a className="vector-nav-link nav-hover" href="#portfolio">PORTFOLIO</a>
            <a className="vector-nav-link nav-hover" href="#contact">CONTACT</a>
          </nav>
        </header>

        <main>
          <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-20 pt-24 sm:pt-28 md:pt-32 relative">
            <div className="max-w-6xl w-full">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Left side - Content */}
                <div className="order-2 md:order-1">
                  {/* Top line */}
                  <div className="w-full h-[1px] bg-[rgba(255,255,255,0.2)] mb-12"></div>
                  
                  <h1 className="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[56px] xl:text-[72px] font-bold text-white leading-none tracking-[2px] md:tracking-[4px] mb-4 md:mb-6 min-h-[80px] sm:min-h-[100px] md:min-h-[120px]">
                    {nameText}<span className="animate-pulse">|</span>
                  </h1>
                  
                  <p className="text-[10px] sm:text-[11px] md:text-[12px] lg:text-[14px] text-[rgba(255,255,255,0.5)] tracking-[2px] md:tracking-[3px] uppercase mb-8 md:mb-12">
                    DEVELOPER & DESIGNER
                  </p>
                  
                  {/* Bottom line */}
                  <div className="w-full h-[1px] bg-[rgba(255,255,255,0.2)] mb-8 md:mb-12"></div>
                  
                  <div className="text-left">
                    <p className="text-[12px] sm:text-[13px] md:text-[14px] text-[rgba(255,255,255,0.5)] leading-relaxed mb-6 md:mb-8 min-h-[60px] sm:min-h-[70px]">
                      {descText}<span className="animate-pulse">{descText.length < fullDesc.length ? '|' : ''}</span>
                    </p>
                    
                    {/* Download Resume Button */}
                    <a 
                      href="/resume.pdf" 
                      download="Mel_Mathew_Albason_Resume.pdf"
                      className="inline-block mb-6 md:mb-8 px-6 py-3 border border-white text-white text-[12px] tracking-[2px] uppercase hover:bg-white hover:text-black transition-all"
                    >
                      Download Resume
                    </a>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 text-[10px] sm:text-[11px] md:text-[12px] text-[rgba(255,255,255,0.5)] uppercase tracking-[1px] md:tracking-[2px]">
                      <div>
                        <div className="mb-2 text-white">Address</div>
                        <div className="min-h-[20px]">{addressText}<span className="animate-pulse">{addressText.length < fullAddress.length ? '|' : ''}</span></div>
                      </div>
                      <div>
                        <div className="mb-2 text-white">EMAIL</div>
                        <div className="break-words min-h-[20px]">{emailText}<span className="animate-pulse">{emailText.length < fullEmail.length ? '|' : ''}</span></div>
                      </div>
                      <div>
                        <div className="mb-2 text-white">WEBSITE</div>
                        <div className="break-words min-h-[20px]">{websiteText}<span className="animate-pulse">{websiteText.length < fullWebsite.length ? '|' : ''}</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Image */}
                <div className="order-1 md:order-2 flex justify-center md:justify-end">
                  <div className="relative w-full max-w-[180px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[300px]">
                    <div className="relative rounded-3xl overflow-hidden">
                      <Image
                        src="/images/dddd.png"
                        alt="Mel Mathew Perez Albason"
                        width={1080}
                        height={1920}
                        className="w-full h-auto object-cover scale-x-[-1]"
                        priority
                        quality={100}
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="about" className="section">
            <div className="section-title animate-on-scroll animate-fade-up">
              <h2>ABOUT ME</h2>
              <p>BACKGROUND & EXPERTISE</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="animate-on-scroll animate-fade-left delay-1">
                <h3 className="text-[24px] font-bold text-white mb-6 tracking-[2px]">MEL MATHEW PEREZ ALBASON</h3>
                <p className="text-[14px] text-[rgba(255,255,255,0.7)] leading-[1.8] mb-6">
                  I am a BS Information Technology student at Quezon City University. I enjoy troubleshooting computers 
                  and typing or holding a keyboard and also fiddling with the parts of the computer.
                </p>
                <p className="text-[14px] text-[rgba(255,255,255,0.7)] leading-[1.8]">
                  I'm here to pursue a challenging and creative career where I acquire new skills, and contribute 
                  effectively to the organization.
                </p>
              </div>

              <div className="animate-on-scroll animate-fade-right delay-2">
                <h4 className="text-[14px] text-white mb-4 tracking-[2px] uppercase">SKILLS</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="pill text-center">PHP</div>
                  <div className="pill text-center">JavaScript</div>
                  <div className="pill text-center">MySql</div>
                  <div className="pill text-center">VB.NET</div>
                  <div className="pill text-center">VB.NET</div>
                  <div className="pill text-center">Troubleshooting</div>
                </div>
              </div>
            </div>
          </section>

          <section id="journey" className="section">
            <div className="section-title animate-on-scroll animate-fade-up">
              <h2>EDUCATION</h2>
              <p>ACADEMIC BACKGROUND</p>
            </div>

            <div className="grid gap-8">
              <div className="border-l-2 border-[rgba(255,255,255,0.2)] pl-8 hover:border-white transition-all animate-on-scroll animate-fade-left delay-1">
                <div className="flex items-center gap-4 mb-2">
                  <Image src="/images/qcu-logo.png" alt="QCU Logo" width={60} height={60} className="object-contain" />
                  <div>
                    <div className="text-[12px] text-[rgba(255,255,255,0.5)] tracking-[2px] uppercase mb-2">2022 - PRESENT</div>
                    <h3 className="text-[18px] font-bold text-white">Quezon City University</h3>
                  </div>
                </div>
                <p className="text-[14px] text-[rgba(255,255,255,0.7)] ml-[76px]">Bachelor of Science in Information Technology</p>
              </div>

              <div className="border-l-2 border-[rgba(255,255,255,0.2)] pl-8 hover:border-white transition-all animate-on-scroll animate-fade-left delay-2">
                <div className="flex items-center gap-4 mb-2">
                  <Image src="/images/seaitt.png" alt="SEAITT Logo" width={60} height={60} className="object-contain" />
                  <div>
                    <div className="text-[12px] text-[rgba(255,255,255,0.5)] tracking-[2px] uppercase mb-2">2019 - 2021</div>
                    <h3 className="text-[18px] font-bold text-white">South East Asia Institute of Trade And Technology</h3>
                  </div>
                </div>
                <p className="text-[14px] text-[rgba(255,255,255,0.7)] ml-[76px]">Humanities and Social Sciences</p>
              </div>

              <div className="border-l-2 border-[rgba(255,255,255,0.2)] pl-8 hover:border-white transition-all animate-on-scroll animate-fade-left delay-3">
                <div className="flex items-center gap-4 mb-2">
                  <Image src="/images/b-silangan.png" alt="Bagong Silangan HS Logo" width={60} height={60} className="object-contain" />
                  <div>
                    <div className="text-[12px] text-[rgba(255,255,255,0.5)] tracking-[2px] uppercase mb-2">2014 - 2018</div>
                    <h3 className="text-[18px] font-bold text-white">Bagong Silangan High School</h3>
                  </div>
                </div>
                <p className="text-[14px] text-[rgba(255,255,255,0.7)] ml-[76px]">High School</p>
              </div>

              <div className="border-l-2 border-[rgba(255,255,255,0.2)] pl-8 hover:border-white transition-all animate-on-scroll animate-fade-left delay-4">
                <div className="flex items-center gap-4 mb-2">
                  <Image src="/images/b-e-silangan.png" alt="Bagong Silangan ES Logo" width={60} height={60} className="object-contain" />
                  <div>
                    <div className="text-[12px] text-[rgba(255,255,255,0.5)] tracking-[2px] uppercase mb-2">2007 - 2013</div>
                    <h3 className="text-[18px] font-bold text-white">Bagong Silangan Elementary School</h3>
                  </div>
                </div>
                <p className="text-[14px] text-[rgba(255,255,255,0.7)] ml-[76px]">Elementary School</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-16 border-t border-[rgba(255,255,255,0.1)]">
              <div className="text-center animate-on-scroll animate-scale delay-1">
                <div className="text-[48px] font-bold text-white mb-2">6</div>
                <div className="text-[12px] text-[rgba(255,255,255,0.5)] tracking-[2px] uppercase">Total Projects</div>
              </div>
              <div 
                className="text-center animate-on-scroll animate-scale delay-2 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setShowCertificates(true)}
              >
                <div className="text-[48px] font-bold text-white mb-2">5</div>
                <div className="text-[12px] text-[rgba(255,255,255,0.5)] tracking-[2px] uppercase">Certificates</div>
              </div>
              <div className="text-center animate-on-scroll animate-scale delay-3">
                <div className="text-[48px] font-bold text-white mb-2">9</div>
                <div className="text-[12px] text-[rgba(255,255,255,0.5)] tracking-[2px] uppercase">Tech Stacks</div>
              </div>
            </div>
          </section>

          <section id="portfolio" className="section">
            <div className="section-title animate-on-scroll animate-fade-up">
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
                      <div className="vector-project-card animate-on-scroll">
                        <div className="project-image-wrapper">
                          <Image 
                            src={project.image} 
                            alt={project.title}
                            width={800}
                            height={400}
                            className="w-full h-[200px] xs:h-[220px] sm:h-[280px] md:h-[350px] lg:h-[400px] object-cover rounded-xl pointer-events-none"
                            draggable={false}
                          />
                          <div className="project-overlay">
                            <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
                              <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2"/>
                              <path d="M 22 32 L 28 38 L 42 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                            </svg>
                          </div>
                        </div>
                        <div className="project-content">
                          <h4 className="mt-2 sm:mt-3 text-base sm:text-lg md:text-xl font-bold flex items-center gap-2">
                            <svg className="w-5 h-5 text-[white]" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                            </svg>
                            {project.title}
                          </h4>
                          <p className="text-white/80 mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed">{project.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? projects.length - 1 : prev - 1))}
                className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-2 md:-translate-x-4 bg-gradient-to-r from-[white] to-[white] text-[#1a1d29] p-2 sm:p-2.5 md:p-3 rounded-full hover:shadow-lg hover:shadow-white/50 transition-all z-10 touch-manipulation"
                aria-label="Previous project"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <button
                onClick={() => setCurrentSlide((prev) => (prev === projects.length - 1 ? 0 : prev + 1))}
                className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-2 md:translate-x-4 bg-gradient-to-r from-[white] to-[white] text-[#1a1d29] p-2 sm:p-2.5 md:p-3 rounded-full hover:shadow-lg hover:shadow-white/50 transition-all z-10 touch-manipulation"
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
                        ? 'bg-gradient-to-r from-[white] to-[white] w-6 sm:w-8' 
                        : 'bg-white/30 hover:bg-white/50 w-1.5 sm:w-2'
                    }`}
                    aria-label={`Go to project ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

 

          <section id="contact" className="section">
            <div className="section-title animate-on-scroll animate-fade-up">
              <h2>CONTACT</h2>
              <p>GET IN TOUCH</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="card animate-on-scroll animate-fade-up delay-1">
                <form onSubmit={handleSubmit} className="mb-12">
                  <input 
                    className="input" 
                    placeholder="Your Name" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <input 
                    className="input" 
                    placeholder="Your Email" 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <textarea 
                    className="input" 
                    rows={4} 
                    placeholder="Your Message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                  <button 
                    type="submit"
                    className="send-btn"
                    disabled={formStatus === "sending"}
                  >
                    {formStatus === "sending" ? "SENDING..." : "SEND MESSAGE"}
                  </button>
                  
                  {formMessage && (
                    <div className={`mt-4 p-3 text-sm ${
                      formStatus === "success" 
                        ? "text-white border border-white" 
                        : "text-red-300 border border-red-500"
                    }`}>
                      {formMessage}
                    </div>
                  )}
                </form>
                
                <div className="pt-8 border-t border-[rgba(255,255,255,0.1)]">
                  <h3 className="text-[14px] text-white mb-6 tracking-[2px] uppercase">Connect With Me</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <a href="https://www.instagram.com/matiyeosczxc_/" target="_blank" rel="noopener noreferrer" className="pill text-center">
                      Instagram
                    </a>
                    <a href="https://www.facebook.com/mathewww12" target="_blank" rel="noopener noreferrer" className="pill text-center">
                      Facebook
                    </a>
                    <a href="https://github.com/melmathewww" target="_blank" rel="noopener noreferrer" className="pill text-center">
                      GitHub
                    </a>
                    <a href="https://www.tiktok.com/@matchuxszxc_" target="_blank" rel="noopener noreferrer" className="pill text-center">
                      TikTok
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer style={{textAlign:'center',padding:'28px 0',color:'rgba(255,255,255,0.55)'}}>© 2025 Mel Mathew Perez Albason</footer>
      </div>

      {/* Certificate Modal */}
      {showCertificates && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowCertificates(false)}
        >
          <div className="relative max-w-6xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowCertificates(false)}
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10 bg-black bg-opacity-50 w-12 h-12 rounded-full flex items-center justify-center"
            >
              ×
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
              {certificates.map((cert, index) => (
                <div key={index} className="bg-white p-4 rounded-lg">
                  <Image
                    src={cert}
                    alt={`Certificate ${index + 1}`}
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
}

