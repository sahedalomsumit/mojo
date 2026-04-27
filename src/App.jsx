import React, { useState, useEffect, useRef } from "react";
import Experience from "./Experience";
import {
  ShoppingCart,
  ArrowDown,
  Zap,
  History,
  Sparkles,
  Globe,
  Heart,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Clear scroll memory to prevent jumping on refresh
if (typeof window !== 'undefined') {
  if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
  }
  ScrollTrigger.clearScrollMemory();
}


function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const container = useRef();

  useGSAP(
    () => {
      // Text reveal animations
      const sections = gsap.utils.toArray(".story-section");
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              end: "bottom 30%",
              toggleActions: "play reverse play reverse",
            },
          },
        );
      });

      // Background giant text parallax
      gsap.to(".bg-mojo-text", {
        y: -200,
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
    },
    { scope: container },
  );

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / totalHeight;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Force scroll to top on refresh with a slight delay to ensure browser restoration is bypassed
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
      if (history.scrollRestoration) {
        history.scrollRestoration = "manual";
      }
      ScrollTrigger.refresh();
    }, 10);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);



  return (
    <div ref={container} className="story-container">
      <div className="bg-pattern-overlay"></div>
      <div className="bg-mojo-text">MOJO</div>

      <nav>
        <a href="#">Legend</a>
        <a href="#energy">Energy</a>
        <a href="#spirit">Spirit</a>
        <a href="#support">Support</a>
        <a href="#magic">Magic</a>
      </nav>

      <Experience scrollProgress={scrollProgress} />

      {/* Hero Section */}
      <section className="story-section hero">
        <div className="content-box">
          <div className="hero-badges">
            <div className="hero-badge bd-badge">
              <div className="flag-icon bd-flag"></div>
              <span>Made In Bangladesh</span>
            </div>
            <div className="hero-badge ps-badge">
              <div className="flag-icon ps-flag">
                <div className="ps-black"></div>
                <div className="ps-white"></div>
                <div className="ps-green"></div>
                <div className="ps-red"></div>
              </div>
              <span>We Support Palestine</span>
            </div>
          </div>
          <p className="hero-subtitle">MY LIFE MY MOJO</p>
          <h1 className="hero-title">MOJO</h1>
          <div
            className="scroll-indicator"
            style={{ opacity: 0.5, marginTop: "2rem" }}
          >
            <ArrowDown size={32} />
          </div>
        </div>
      </section>

      {/* Chapter 2: The Energy */}
      <section id="energy" className="story-section">
        <div className="content-box left">
          <span className="section-tag">
            <Zap size={24} /> THE BITE
          </span>
          <h2>
            EXTREME
            <br />
            REFRESHMENT
          </h2>
          <p>
            <span style={{ color: "var(--mojo-white)", fontWeight: "900" }}>
              MOJO
            </span>{" "}
            isn't just a drink; it's a surge of high-voltage energy. More fizz,
            more flavor, and the unmistakable local bite that defines a
            generation.
          </p>
        </div>
      </section>

      {/* Chapter 3: The Local Spirit */}
      <section id="spirit" className="story-section">
        <div className="content-box right">
          <span className="section-tag">
            <History size={24} /> THE ART
          </span>
          <h2>
            RICKSHAW
            <br />
            SPIRIT
          </h2>
          <p>
            Wrapped in the soul of the city.{" "}
            <span style={{ color: "var(--mojo-white)", fontWeight: "900" }}>
              MOJO
            </span>{" "}
            celebrates the vibrant{" "}
            <span style={{ color: "#ffeb3b", fontWeight: "900" }}>
              Rickshaw Art
            </span>{" "}
            of{" "}
            <span
              style={{ color: "#006a4e", background: "#fff", padding: "0 5px" }}
            >
              Bangladesh
            </span>
            . A fusion of tradition and the bold energy of today.
          </p>
        </div>
      </section>

      {/* Chapter 4: Support Palestine */}
      <section id="support" className="story-section support-palestine">
        <div className="content-box left">
          <div className="palestine-flag-strip">
            <div className="strip-black"></div>
            <div className="strip-white"></div>
            <div className="strip-green"></div>
            <div className="strip-red"></div>
          </div>
          <span className="section-tag">
            <Heart size={24} fill="#ef4444" color="#ef4444" /> SOLIDARITY
          </span>
          <h2 style={{ color: "#fff" }}>
            WE STAND WITH
            <br />
            PALESTINE
          </h2>
          <p className="palestine-text">
            <span style={{ color: "var(--mojo-white)", fontWeight: "900" }}>
              MOJO
            </span>{" "}
            stands for justice and humanity. We are committed to supporting the
            people of{" "}
            <span style={{ color: "#10b981", fontWeight: "900" }}>
              Palestine
            </span>{" "}
            in their journey towards peace and freedom.
          </p>
          <div className="palestine-kufiya-pattern"></div>
        </div>
      </section>

      {/* Chapter 5: Get Your Mojo */}
      <section id="magic" className="story-section">
        <div className="content-box center">
          <span className="section-tag">
            <Sparkles size={24} /> THE CALL
          </span>
          <h2 className="magic-title">
            UNLEASH
            <br />
            YOUR MOJO
          </h2>
          <button
            className="btn-premium"
            onClick={() => alert("Mojo Secured!")}
          >
            <ShoppingCart
              size={32}
              style={{ marginRight: "15px", verticalAlign: "middle" }}
            />
            ACQUIRE MOJO
          </button>
        </div>
      </section>

      <footer className="main-footer">
        <div className="footer-links">
          <span>PROUDLY LOCAL</span>
          <span style={{ color: "#00ff9d" }}>FREE PALESTINE</span>
        </div>

        <a
          href="https://sahedalomsumit.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.875rem",
              color: "#ffffff",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.25s ease, color 0.25s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#ff8719")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#ffffff")}
          >
            <span>Built with</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="#ef4444"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transformOrigin: "center",
                flexShrink: 0,
                animation: "pulseHeart 1.2s infinite ease-in-out",
              }}
              aria-hidden="true"
            >
              <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
            </svg>

            <span>by</span>
            <span style={{ color: "#ffdb58", fontWeight: "800" }}>Sahed</span>
          </div>
        </a>
      </footer>
    </div>
  );
}

export default App;
