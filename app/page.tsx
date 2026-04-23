"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ParticlesBackground from "./components/ParticlesBackground";
import TicTacToe from "./components/TicTacToe";

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
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a] border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between gap-5 px-8 md:px-20 py-6">
          <div className="font-bold text-[20px] md:text-[24px] text-white tracking-[4px]">MEL MATHEW</div>
          <nav className="flex gap-8 md:gap-12 items-center" aria-label="Main navigation">
            <a className="vector-nav-link nav-hover" href="#home">HOME</a>
            <a className="vector-nav-link nav-hover" href="#about">ABOUT</a>
            <a className="vector-nav-link nav-hover" href="#portfolio">PORTFOLIO</a>
            <a className="vector-nav-link nav-hover" href="#contact">CONTACT</a>
          </nav>
        </header>

        <main>
          <section id="home" className="min-h-screen flex items-center justify-center px-8 md:px-20 pt-32 md:pt-24 relative">
            <div className="max-w-6xl w-full">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left side - Content */}
                <div className="order-2 md:order-1">
                  {/* Top line */}
                  <div className="w-full h-[1px] bg-[rgba(255,255,255,0.2)] mb-12"></div>
                  
                  <h1 className="text-[36px] md:text-[56px] lg:text-[72px] font-bold text-white leading-none tracking-[4px] mb-6">
                    MEL MATHEW ALBASON
                  </h1>
                  
                  <p className="text-[12px] md:text-[14px] text-[rgba(255,255,255,0.5)] tracking-[3px] uppercase mb-12">
                    DEVELOPER & DESIGNER
                  </p>
                  
                  {/* Bottom line */}
                  <div className="w-full h-[1px] bg-[rgba(255,255,255,0.2)] mb-12"></div>
                  
                  <div className="text-left">
                    <p className="text-[13px] md:text-[14px] text-[rgba(255,255,255,0.5)] leading-relaxed mb-8">
                      BS Information Technology student at Quezon City University. Passionate about web development, 
                      troubleshooting, and creating innovative solutions.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] md:text-[12px] text-[rgba(255,255,255,0.5)] uppercase tracking-[2px]">
                      <div>
                        <div className="mb-2 text-white">Address</div>
                        <div>Quezon City, Philippines</div>
                      </div>
                      <div>
                        <div className="mb-2 text-white">EMAIL</div>
                        <div className="break-words">melmathewzxc12@gmail.com</div>
                      </div>
                      <div>
                        <div className="mb-2 text-white">WEBSITE</div>
                        <div className="break-words">www.melmathew.dev</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Image */}
                <div className="order-1 md:order-2 flex justify-center md:justify-end">
                  <div className="relative w-full max-w-[220px] md:max-w-[300px] ">
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
          </section>

          <section id="about" className="section">
            <div className="section-title">
              <h2>ABOUT ME</h2>
              <p>BACKGROUND & EXPERTISE</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
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

              <div>
                <h4 className="text-[14px] text-white mb-4 tracking-[2px] uppercase">SKILLS</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="pill text-center">PHP</div>
                  <div className="pill text-center">JavaScript</div>
                  <div className="pill text-center">HTML</div>
                  <div className="pill text-center">CSS</div>
                  <div className="pill text-center">VB.NET</div>
                  <div className="pill text-center">Node.js</div>
                </div>
              </div>
            </div>
          </section>

          <section id="journey" className="section">
            <div className="section-title">
              <h2>EDUCATION</h2>
              <p>ACADEMIC BACKGROUND</p>
            </div>

            <div className="grid gap-8">
              <div className="border-l-2 border-[rgba(255,255,255,0.2)] pl-8 hover:border-white transition-all">
                <div className="text-[12px] text-[rgba(255,255,255,0.5)] tracking-[2px] uppercase mb-2">2022 - PRESENT</div>
                <h3 className="text-[18px] font-bold text-white mb-2">Quezon City University</h3>
                <p className="text-[14px] text-[rgba(255,255,255,0.7)]">Bachelor of Science in Information Technology</p>
              </div>

              <div className="border-l-2 border-[rgba(255,255,255,0.2)] pl-8 hover:border-white transition-all">
                <div className="text-[12px] text-[rgba(255,255,255,0.5)] tracking-[2px] uppercase mb-2">2019 - 2021</div>
                <h3 className="text-[18px] font-bold text-white mb-2">South East Asia Institute of Trade And Technology</h3>
                <p className="text-[14px] text-[rgba(255,255,255,0.7)]">Humanities and Social Sciences</p>
              </div>

              <div className="border-l-2 border-[rgba(255,255,255,0.2)] pl-8 hover:border-white transition-all">
                <div className="text-[12px] text-[rgba(255,255,255,0.5)] tracking-[2px] uppercase mb-2">2014 - 2018</div>
                <h3 className="text-[18px] font-bold text-white mb-2">Bagong Silangan High School</h3>
                <p className="text-[14px] text-[rgba(255,255,255,0.7)]">High School</p>
              </div>

              <div className="border-l-2 border-[rgba(255,255,255,0.2)] pl-8 hover:border-white transition-all">
                <div className="text-[12px] text-[rgba(255,255,255,0.5)] tracking-[2px] uppercase mb-2">2007 - 2013</div>
                <h3 className="text-[18px] font-bold text-white mb-2">Bagong Silangan Elementary School</h3>
                <p className="text-[14px] text-[rgba(255,255,255,0.7)]">Elementary School</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-16 border-t border-[rgba(255,255,255,0.1)]">
              <div className="text-center">
                <div className="text-[48px] font-bold text-white mb-2">6</div>
                <div className="text-[12px] text-[rgba(255,255,255,0.5)] tracking-[2px] uppercase">Total Projects</div>
              </div>
              <div className="text-center">
                <div className="text-[48px] font-bold text-white mb-2">4</div>
                <div className="text-[12px] text-[rgba(255,255,255,0.5)] tracking-[2px] uppercase">Certificates</div>
              </div>
              <div className="text-center">
                <div className="text-[48px] font-bold text-white mb-2">9</div>
                <div className="text-[12px] text-[rgba(255,255,255,0.5)] tracking-[2px] uppercase">Tech Stacks</div>
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
                            <svg className="w-5 h-5 text-[#00d9ff]" viewBox="0 0 24 24" fill="currentColor">
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

          <section id="game" className="section">
            <div className="section-title animate-on-scroll">
              <h2><b>Play Tic-Tac-Toe</b></h2>
              <p><i>Challenge yourself or a friend to a classic game of XOX!</i></p>
            </div>

            <div className="animate-on-scroll delay-1">
              <TicTacToe />
            </div>
          </section>

          <section id="contact" className="section">
            <div className="section-title">
              <h2>CONTACT</h2>
              <p>GET IN TOUCH</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="card">
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
                    <a href="https://github.com/letsfckntry" target="_blank" rel="noopener noreferrer" className="pill text-center">
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
    </div>
    
  );
}

