"use client";

import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import { useMegaLeadForm } from "@/hooks/useMegaLeadForm";
import { formatPhone, isValidPhone } from "@/hooks/usePhoneValidation";

/* ─── Constants ─── */
const PHONE = "855-578-6788";
const PHONE_HREF = "tel:18555786788";
const CTA_TEXT = "Get My Free Consultation";

/* ─── Client Images from blindscrafter.com ─── */
const IMG = {
  hero: "https://blindscrafter.com/wp-content/uploads/2025/03/custom-window-blinds-installation.jpeg",
  blinds: "https://blindscrafter.com/wp-content/uploads/2025/03/Wood-Blinds.webp",
  shades: "https://blindscrafter.com/wp-content/uploads/2025/03/Zebra-Shade-Blinds-Crafter-scaled.webp",
  motorized: "https://blindscrafter.com/wp-content/uploads/2025/03/Motorized-Blinds.webp",
  smartHome: "https://blindscrafter.com/wp-content/uploads/2025/03/motorization-smart-home-solutions.jpg",
  installation: "https://blindscrafter.com/wp-content/uploads/2025/03/horizontal-blinds-installation.jpeg",
  shutters: "https://blindscrafter.com/wp-content/uploads/2025/03/Window-Shutters-1.webp",
};

/* ─── Scroll Reveal Hook ─── */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Lead Form ─── */
function LeadForm({ compact = false }: { compact?: boolean }) {
  const { submit } = useMegaLeadForm();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [windowsCount, setWindowsCount] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "First name required";
    if (!lastName.trim()) e.lastName = "Last name required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Valid email required";
    if (!isValidPhone(phone)) e.phone = "Valid 10-digit phone required";
    if (!address.trim()) e.address = "Home address required";
    if (!windowsCount) e.windowsCount = "Please select window count";
    return e;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    setServerError("");
    try {
      await submit({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.replace(/\D/g, ""),
        address: address.trim(),
        windows_count: windowsCount,
      });
      setSubmitted(true);
    } catch {
      setServerError("Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const inp = (field: string) =>
    `w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#BC4F35] ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
    }`;

  if (submitted) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-[#1a0e0b]">You are all set!</h3>
        <p className="mb-4 text-gray-600">Our team will call within 24 hours to schedule your free in-home consultation.</p>
        <a href={PHONE_HREF} className="inline-block text-lg font-bold text-[#BC4F35] underline">{PHONE}</a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`rounded-2xl bg-white shadow-xl ${compact ? "p-6" : "p-6 lg:p-8"} space-y-4`}
      aria-label="Free in-home consultation form"
    >
      <div className="border-b border-gray-100 pb-4">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-[#BC4F35]">
          Free Installation — No Obligation
        </p>
        <h2 className="mt-1 text-center text-xl font-bold text-[#1a0e0b] leading-tight">
          Get Your Free In-Home Consultation
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className="mb-1 block text-xs font-semibold text-gray-700">First Name *</label>
          <input id="firstName" type="text" autoComplete="given-name" value={firstName}
            onChange={(e) => setFirstName(e.target.value)} className={inp("firstName")} placeholder="Jane" />
          {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className="mb-1 block text-xs font-semibold text-gray-700">Last Name *</label>
          <input id="lastName" type="text" autoComplete="family-name" value={lastName}
            onChange={(e) => setLastName(e.target.value)} className={inp("lastName")} placeholder="Smith" />
          {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-xs font-semibold text-gray-700">Email Address *</label>
        <input id="email" type="email" autoComplete="email" value={email}
          onChange={(e) => setEmail(e.target.value)} className={inp("email")} placeholder="jane@example.com" />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-xs font-semibold text-gray-700">Phone Number *</label>
        <input id="phone" type="tel" autoComplete="tel" value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))} className={inp("phone")} placeholder="(201) 555-0100" />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="address" className="mb-1 block text-xs font-semibold text-gray-700">Home Address *</label>
        <input id="address" type="text" autoComplete="street-address" value={address}
          onChange={(e) => setAddress(e.target.value)} className={inp("address")} placeholder="123 Main St, Paramus, NJ" />
        {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
      </div>

      <div>
        <label htmlFor="windowsCount" className="mb-1 block text-xs font-semibold text-gray-700">How many windows/blinds do you need? *</label>
        <select id="windowsCount" name="windowsCount" value={windowsCount}
          onChange={(e) => setWindowsCount(e.target.value)}
          className={`${inp("windowsCount")} appearance-none`}>
          <option value="">Select number of windows/blinds</option>
          <option value="1-5">1–5 windows/blinds</option>
          <option value="5-10">5–10 windows/blinds</option>
          <option value="10-15">10–15 windows/blinds</option>
          <option value="15+">15+ windows/blinds</option>
        </select>
        {errors.windowsCount && <p className="mt-1 text-xs text-red-500">{errors.windowsCount}</p>}
      </div>

      {serverError && <p className="text-sm text-red-500">{serverError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="pulse-brand w-full rounded-xl bg-[#BC4F35] px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-[#a3432d] disabled:opacity-60"
      >
        {submitting ? "Submitting..." : CTA_TEXT}
      </button>

      <p className="text-center text-xs text-gray-400">
        No spam. We call within 24 hours. Or call now:{" "}
        <a href={PHONE_HREF} className="text-[#BC4F35] font-semibold hover:underline">{PHONE}</a>
      </p>
    </form>
  );
}

/* ─── SVG Icons (no emojis) ─── */
const CheckIcon = () => (
  <svg className="h-5 w-5 flex-shrink-0 text-[#BC4F35]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
  </svg>
);

const StarIcon = () => (
  <svg className="h-5 w-5 text-[#BC4F35]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

/* ─── Page Component ─── */
export default function Home() {
  useReveal();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ─── HEADER ─── */}
      <header
        className={`fixed top-0 z-50 w-full bg-[#1a0e0b] transition-shadow ${scrolled ? "shadow-2xl" : ""}`}
        role="banner"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
          <a href="/" aria-label="Blinds Crafter home">
            <Image
              src="/images/logo-white.webp"
              alt="Blinds Crafter"
              width={180}
              height={48}
              className="h-12 w-auto md:h-14 lg:h-16"
              priority
            />
          </a>
          <div className="flex items-center gap-3">
            <a
              href={PHONE_HREF}
              className="hidden items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white md:flex"
              aria-label={`Call ${PHONE}`}
            >
              <PhoneIcon />
              {PHONE}
            </a>
            <a
              href="#contact"
              className="rounded-lg bg-[#BC4F35] px-4 py-2.5 text-sm font-bold text-white shadow transition hover:bg-[#a3432d]"
              onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              Free Consultation
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ─── HERO ─── */}
        <section
          id="hero"
          className="relative min-h-[92vh] bg-[#1a0e0b] pt-20 flex items-center"
          aria-label="Hero — Custom Blinds and Shades"
        >
          {/* Hero background image */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={IMG.hero}
              alt="Professional blind installation in a Northern NJ home"
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a0e0b] from-10% via-[#1a0e0b]/85 via-50% to-[#1a0e0b]/40 to-100%" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Left — headline + offers */}
              <div className="text-white">
                <p className="mb-4 inline-block rounded-full border border-[#BC4F35]/40 bg-[#BC4F35]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#e8947a]">
                  Northern NJ Premium Window Treatments
                </p>
                <h1 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight [text-shadow:0_2px_4px_rgba(0,0,0,0.7)] md:text-5xl lg:text-6xl">
                  Custom Blinds &amp; Shades —{" "}
                  <span className="text-[#BC4F35]">Installed Free</span>
                </h1>
                <p className="mb-8 max-w-lg text-lg leading-relaxed text-white/80">
                  Precision-crafted window treatments for NJ homes valued at $700k and above.
                  Every order includes free professional installation, BOGO free motorization, and
                  complimentary smart home integration with Alexa, Google Home, and HomeKit.
                </p>

                {/* Offer list — SVG icons, no emojis */}
                <ul className="mb-8 space-y-4" aria-label="Current offers">
                  {[
                    { label: "Free Smart Home Integration", sub: "Alexa · Google Home · Apple HomeKit — included on every motorized order" },
                    { label: "Buy One Get One Free Motorization", sub: "Buy motorization on one window, get the next window free" },
                    { label: "Free Professional Installation", sub: "On all orders, no minimums, no hidden fees" },
                    { label: "Free In-Home Consultation", sub: "Same-week appointments available across Northern NJ" },
                  ].map(({ label, sub }) => (
                    <li key={label} className="flex items-start gap-3">
                      <CheckIcon />
                      <span>
                        <span className="font-bold text-white">{label}</span>
                        <span className="mt-0.5 block text-sm text-white/60">{sub}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Trust bar */}
                <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
                  <span className="flex items-center gap-1.5"><StarIcon /><strong className="text-white">4.9</strong> Google Rating</span>
                  <span>200+ NJ Homeowners</span>
                  <span>NJ Licensed &amp; Insured</span>
                  <span>Same-Day Response</span>
                </div>

                {/* Hero CTAs */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#contact"
                    onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                    className="pulse-brand inline-flex items-center justify-center rounded-xl bg-[#BC4F35] px-8 py-4 text-base font-bold text-white shadow-lg transition hover:bg-[#a3432d]"
                  >
                    Get My Free Consultation
                  </a>
                  <a
                    href={PHONE_HREF}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition hover:border-white hover:bg-white/10"
                  >
                    <PhoneIcon />
                    {PHONE}
                  </a>
                </div>
              </div>

              {/* Right — form */}
              <div id="contact">
                <LeadForm />
              </div>
            </div>
          </div>
        </section>

        {/* ─── SOCIAL PROOF BAND ─── */}
        <section
          id="social-proof"
          className="border-b border-gray-100 bg-white py-8"
          aria-label="Trust indicators"
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-wrap items-center justify-center gap-8 text-center md:gap-14">
              {[
                { stat: "200+", label: "NJ Homeowners Served" },
                { stat: "4.9", label: "Google Star Rating" },
                { stat: "$0", label: "Installation Fee" },
                { stat: "15+", label: "Years Experience" },
                { stat: "Same Week", label: "Appointments Available" },
              ].map(({ stat, label }) => (
                <div key={label}>
                  <div className="text-2xl font-extrabold text-[#BC4F35] md:text-3xl">{stat}</div>
                  <div className="mt-0.5 text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CUSTOM WINDOW BLINDS ─── */}
        <section
          id="window-blinds"
          className="bg-[#faf6f4] py-24"
          aria-labelledby="blinds-heading"
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="reveal grid items-center gap-12 lg:grid-cols-2">
              {/* Image */}
              <div className="relative h-80 overflow-hidden rounded-2xl shadow-xl lg:h-[480px]">
                <Image
                  src={IMG.blinds}
                  alt="Custom wood window blinds installed in a Northern NJ home"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Copy */}
              <div>
                <span className="mb-3 inline-block rounded-full bg-[#BC4F35]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#BC4F35]">
                  Custom Window Blinds
                </span>
                <h2 id="blinds-heading" className="mb-4 text-3xl font-extrabold leading-tight text-[#1a0e0b] md:text-4xl">
                  Precision-Cut Blinds for Every Window in Your NJ Home
                </h2>
                <p className="mb-4 leading-relaxed text-gray-600">
                  No two windows are identical, and off-the-shelf blinds show it. We measure each window
                  to the millimeter, craft your blinds to exact specification, and install everything
                  — so you never deal with ill-fitting gaps or sagging edges.
                </p>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Choose from real wood for warmth and character, faux wood for kitchens and baths,
                  aluminum for modern spaces, or vertical blinds for panoramic sliding doors. Every style
                  is available in blackout, light-filtering, or sheer options to match how each room lives.
                </p>
                <ul className="mb-8 space-y-2.5 text-sm text-gray-700">
                  {[
                    "Real wood, faux wood, aluminum, vinyl, and vertical blinds",
                    "Blackout options for bedrooms and media rooms",
                    "Cordless and child-safe designs available",
                    "Custom sizing for odd-shaped and oversized windows",
                    "Free professional installation included on every order",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="inline-block rounded-xl bg-[#BC4F35] px-8 py-3.5 font-bold text-white shadow-lg transition hover:bg-[#a3432d]"
                >
                  Get My Free Consultation
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── DESIGNER SHADES ─── */}
        <section
          id="window-shades"
          className="bg-white py-24"
          aria-labelledby="shades-heading"
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="reveal grid items-center gap-12 lg:grid-cols-2">
              {/* Copy — left */}
              <div className="order-2 lg:order-1">
                <span className="mb-3 inline-block rounded-full bg-[#BC4F35]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#BC4F35]">
                  Designer Shades
                </span>
                <h2 id="shades-heading" className="mb-4 text-3xl font-extrabold leading-tight text-[#1a0e0b] md:text-4xl">
                  Shades That Control Light and Elevate Every Room
                </h2>
                <p className="mb-4 leading-relaxed text-gray-600">
                  From the elegant drape of Roman shades to the clean roll of solar shades that block
                  90% of UV rays while preserving your view, our shade collection transforms how light
                  feels in your home. Cellular honeycomb shades add an insulating air pocket that keeps
                  NJ winters warmer and summer energy bills lower.
                </p>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Zebra shades let you dial from full transparency to complete privacy — perfect for living
                  rooms where you need flexibility throughout the day. Every shade arrives custom-cut to
                  your exact dimensions and is installed by our certified team at no extra charge.
                </p>
                <ul className="mb-8 space-y-2.5 text-sm text-gray-700">
                  {[
                    "Roller, Roman, solar, sheer, zebra, and cellular shades",
                    "UV-blocking options to protect furniture and floors",
                    "Energy-efficient honeycomb cellular designs",
                    "Woven wood and bamboo for natural texture",
                    "Custom fabric selection for every design style",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="inline-block rounded-xl bg-[#BC4F35] px-8 py-3.5 font-bold text-white shadow-lg transition hover:bg-[#a3432d]"
                >
                  Get My Free Consultation
                </a>
              </div>
              {/* Image — right */}
              <div className="relative order-1 h-80 overflow-hidden rounded-2xl shadow-xl lg:order-2 lg:h-[480px]">
                <Image
                  src={IMG.shades}
                  alt="Zebra shades installed in a Northern NJ living room"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── MOTORIZED TREATMENTS ─── */}
        <section
          id="motorized-treatments"
          className="bg-[#1a0e0b] py-24"
          aria-labelledby="motorized-heading"
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="reveal grid items-center gap-12 lg:grid-cols-2">
              {/* Image */}
              <div className="relative h-80 overflow-hidden rounded-2xl shadow-2xl lg:h-[480px]">
                <Image
                  src={IMG.motorized}
                  alt="Motorized blinds controlled by smartphone app"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Copy */}
              <div className="text-white">
                <span className="mb-3 inline-block rounded-full bg-[#BC4F35]/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#e8947a]">
                  BOGO Free Motorization
                </span>
                <h2 id="motorized-heading" className="mb-4 text-3xl font-extrabold leading-tight md:text-4xl">
                  Motorized Window Treatments — Effortless Control, Every Day
                </h2>
                <p className="mb-4 leading-relaxed text-white/75">
                  Motorized blinds and shades put full control in your hands — from your phone, a
                  remote, or your voice. Schedule them to open at sunrise and close at dusk automatically,
                  protecting your furniture from UV fading while keeping your home comfortable all day.
                </p>
                <p className="mb-6 leading-relaxed text-white/75">
                  Our systems use whisper-quiet motors that run on battery — no electrical rewiring
                  required on most installations. One tap covers every window in the house.
                </p>
                <ul className="mb-8 space-y-3 text-white/80">
                  {[
                    "App and remote control for every room at once",
                    "Schedule open/close by time or sunrise/sunset",
                    "Battery-powered — no electrical rewiring needed",
                    "Silent motor technology for undisturbed ambiance",
                    "Compatible with scenes, routines, and automations",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {/* BOGO callout */}
                <div className="mb-6 rounded-xl border border-[#BC4F35]/40 bg-[#BC4F35]/10 p-4">
                  <p className="text-sm font-bold uppercase tracking-wider text-[#e8947a]">Limited Time Offer</p>
                  <p className="mt-1 text-xl font-extrabold text-white">Buy Motorization on 1 Window — Get the Next Free</p>
                </div>
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="inline-block rounded-xl bg-[#BC4F35] px-8 py-3.5 font-bold text-white shadow-lg transition hover:bg-[#a3432d]"
                >
                  Claim My BOGO Deal
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SMART HOME INTEGRATION ─── */}
        <section
          id="smart-home-integration"
          className="bg-[#faf6f4] py-24"
          aria-labelledby="smart-home-heading"
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="reveal grid items-center gap-12 lg:grid-cols-2">
              {/* Copy */}
              <div>
                <span className="mb-3 inline-block rounded-full bg-[#BC4F35]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#BC4F35]">
                  Free Smart Home Integration
                </span>
                <h2 id="smart-home-heading" className="mb-4 text-3xl font-extrabold leading-tight text-[#1a0e0b] md:text-4xl">
                  Alexa, Google Home &amp; Apple HomeKit — Included at No Charge
                </h2>
                <p className="mb-4 leading-relaxed text-gray-600">
                  Every motorized window treatment we install comes with complimentary smart home
                  integration — no add-on fee, no separate appointment. Your new blinds and shades
                  work seamlessly with Alexa, Google Home, and Apple HomeKit right from day one.
                </p>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Tell Alexa to close the bedroom shades, or set a Google Home routine that lowers the
                  living room blinds when your thermostat senses afternoon sun. Group all your window
                  treatments into scenes and control an entire floor with a single command. Our certified
                  technicians handle the full setup — you walk into a smarter home.
                </p>

                {/* Platform cards — SVG, no emoji */}
                <div className="mb-8 grid grid-cols-3 gap-4">
                  {[
                    { name: "Amazon Alexa", icon: (
                      <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#BC4F35]" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-.5 14.5c-3.038 0-5.5-2.462-5.5-5.5S8.962 5.5 12 5.5s5.5 2.462 5.5 5.5-2.462 5.5-5.5 5.5zm.5-9a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"/></svg>
                    )},
                    { name: "Google Home", icon: (
                      <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#BC4F35]" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 4a6 6 0 100 12A6 6 0 0012 6zm0 2a4 4 0 110 8 4 4 0 010-8z"/></svg>
                    )},
                    { name: "Apple HomeKit", icon: (
                      <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#BC4F35]" fill="currentColor" aria-hidden="true"><path d="M10 20v-6H4V10h6V4h4v6h6v4h-6v6z"/></svg>
                    )},
                  ].map(({ name, icon }) => (
                    <div key={name} className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                      {icon}
                      <p className="text-xs font-semibold text-gray-700">{name}</p>
                    </div>
                  ))}
                </div>

                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="inline-block rounded-xl bg-[#BC4F35] px-8 py-3.5 font-bold text-white shadow-lg transition hover:bg-[#a3432d]"
                >
                  Get Free Smart Home Setup
                </a>
              </div>

              {/* Image */}
              <div className="relative h-80 overflow-hidden rounded-2xl shadow-xl lg:h-[480px]">
                <Image
                  src={IMG.smartHome}
                  alt="Smart home motorized shades controlled by Alexa and Google Home"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── FREE INSTALLATION ─── */}
        <section
          id="free-installation"
          className="bg-white py-24"
          aria-labelledby="installation-heading"
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="reveal grid items-center gap-12 lg:grid-cols-2">
              {/* Image */}
              <div className="relative h-80 overflow-hidden rounded-2xl shadow-xl lg:h-[440px]">
                <Image
                  src={IMG.installation}
                  alt="Professional blind installer measuring windows in a Northern NJ home"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Copy */}
              <div>
                <span className="mb-3 inline-block rounded-full bg-[#BC4F35]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#BC4F35]">
                  Free Professional Installation
                </span>
                <h2 id="installation-heading" className="mb-4 text-3xl font-extrabold leading-tight text-[#1a0e0b] md:text-4xl">
                  We Measure, We Install — You Never Touch a Drill
                </h2>
                <p className="mb-4 leading-relaxed text-gray-600">
                  Every Blinds Crafter order includes free in-home professional installation. Our
                  licensed installers handle precision measurement, mounting hardware, leveling, and
                  final fitting so every blind and shade hangs exactly right — no gaps, no wobble,
                  no returns.
                </p>
                <p className="mb-6 leading-relaxed text-gray-600">
                  We work entirely around your schedule. Same-week appointments are available across
                  Northern NJ, and our team treats your home with the same care we would our own.
                </p>
                <ul className="mb-8 space-y-2.5 text-sm text-gray-700">
                  {[
                    "Free in-home measurement by certified technicians",
                    "Professional mounting, leveling, and finishing",
                    "Same-week appointments available",
                    "Licensed and insured in New Jersey",
                    "Workmanship guarantee — we return if anything is off",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="inline-block rounded-xl bg-[#BC4F35] px-8 py-3.5 font-bold text-white shadow-lg transition hover:bg-[#a3432d]"
                >
                  Book Free In-Home Visit
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── WHY BLINDS CRAFTER ─── */}
        <section
          id="why-blinds-crafter"
          className="bg-[#1a0e0b] py-24"
          aria-labelledby="why-heading"
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="reveal mb-14 text-center">
              <h2 id="why-heading" className="mb-3 text-3xl font-extrabold text-white md:text-4xl">
                Why Northern NJ Homeowners Choose Blinds Crafter
              </h2>
              <p className="mx-auto max-w-xl text-white/60">
                We are a local NJ company — based in Carlstadt — that has been transforming homes in
                Ridgewood, Paramus, Montclair, and across the region for over a decade.
              </p>
            </div>
            <div className="reveal grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Precision Custom Fit",
                  body: "Every product is measured and cut to your exact window dimensions. No gaps, no guessing. We measure, you approve, we install.",
                  icon: (
                    <svg className="h-7 w-7 text-[#BC4F35]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h1m-1 4h1m4-4h1m-1 4h1M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zM9 3h6v4H9V3z" />
                    </svg>
                  ),
                },
                {
                  title: "Free Professional Installation",
                  body: "Certified installers handle everything — measurement, mounting, and finishing. Included at no extra charge on every single order.",
                  icon: (
                    <svg className="h-7 w-7 text-[#BC4F35]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                    </svg>
                  ),
                },
                {
                  title: "4.9-Star Google Rating",
                  body: "Over 200 NJ homeowners trust us with their windows. Our 4.9-star rating reflects the care we bring to every project, start to finish.",
                  icon: (
                    <svg className="h-7 w-7 text-[#BC4F35]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ),
                },
                {
                  title: "Local Northern NJ Team",
                  body: "Based in Carlstadt, NJ. We serve Ridgewood, Paramus, Montclair, and all of Northern NJ. Same-week appointments, fast follow-through.",
                  icon: (
                    <svg className="h-7 w-7 text-[#BC4F35]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  ),
                },
                {
                  title: "Licensed &amp; Insured",
                  body: "Fully licensed and insured in New Jersey. Every installation is backed by our workmanship guarantee — if anything is off, we return and fix it.",
                  icon: (
                    <svg className="h-7 w-7 text-[#BC4F35]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  ),
                },
                {
                  title: "Direct Manufacturer Pricing",
                  body: "We source directly from manufacturers to eliminate markups. Premium custom products at prices that make sense for your home and budget.",
                  icon: (
                    <svg className="h-7 w-7 text-[#BC4F35]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                },
              ].map(({ icon, title, body }) => (
                <div key={title} className="rounded-2xl bg-white/5 p-6 text-white">
                  <div className="mb-4">{icon}</div>
                  <h3 className="mb-2 text-base font-bold" dangerouslySetInnerHTML={{ __html: title }} />
                  <p className="text-sm leading-relaxed text-white/60">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section
          id="testimonials"
          className="bg-[#faf6f4] py-24"
          aria-labelledby="testimonials-heading"
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="reveal mb-14 text-center">
              <h2 id="testimonials-heading" className="mb-3 text-3xl font-extrabold text-[#1a0e0b] md:text-4xl">
                What Our Customers Say
              </h2>
              <div className="flex justify-center gap-0.5" aria-label="4.9 out of 5 stars">
                {[1,2,3,4,5].map((i) => <StarIcon key={i} />)}
                <span className="ml-2 text-sm text-gray-500">4.9 · 200+ Google Reviews</span>
              </div>
            </div>
            <div className="reveal grid gap-6 md:grid-cols-3">
              {[
                {
                  quote: "Blinds Crafter transformed every room in our home. The motorized shades connect seamlessly to our Alexa and the installation was flawless. I cannot believe installation was free — the value is unbeatable.",
                  name: "Sarah M.",
                  location: "Ridgewood, NJ",
                },
                {
                  quote: "We got the BOGO motorization deal and it saved us over $800. The team was on time, professional, and the blinds fit perfectly. Our home looks like it belongs in a magazine now.",
                  name: "David &amp; Karen L.",
                  location: "Paramus, NJ",
                },
                {
                  quote: "From consultation to installation, every step was smooth. They set up our HomeKit integration in 20 minutes and walked us through everything. Exceptional service from a real local NJ company.",
                  name: "Michael T.",
                  location: "Montclair, NJ",
                },
              ].map(({ quote, name, location }) => (
                <div key={name} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="mb-3 flex gap-0.5" aria-hidden="true">
                    {[1,2,3,4,5].map((i) => <StarIcon key={i} />)}
                  </div>
                  <p className="mb-5 text-sm italic leading-relaxed text-gray-600">
                    &ldquo;{quote}&rdquo;
                  </p>
                  <p className="font-bold text-[#1a0e0b]" dangerouslySetInnerHTML={{ __html: name }} />
                  <p className="text-xs text-gray-400">{location}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── BOTTOM FORM / GET STARTED ─── */}
        <section
          id="get-started"
          className="bg-[#BC4F35] py-24"
          aria-labelledby="get-started-heading"
        >
          <div className="mx-auto max-w-2xl px-4">
            <div className="reveal mb-8 text-center text-white">
              <h2 id="get-started-heading" className="mb-3 text-3xl font-extrabold md:text-4xl">
                Ready to Transform Your Windows?
              </h2>
              <p className="text-white/80">
                Book your free in-home consultation. We bring samples, take measurements, and give
                you a custom quote — no pressure, no obligation.
              </p>
            </div>
            <div className="reveal">
              <LeadForm compact />
            </div>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#1a0e0b] py-10 text-center text-sm text-white/40" role="contentinfo">
        <div className="mx-auto max-w-4xl px-4">
          <Image
            src="/images/logo-white.webp"
            alt="Blinds Crafter"
            width={140}
            height={38}
            className="mx-auto mb-4 h-10 w-auto opacity-70"
          />
          <p className="mb-1 text-white/50">414 Hackensack St, Carlstadt, NJ 07072</p>
          <p className="mb-4">
            <a href={PHONE_HREF} className="text-white/50 transition hover:text-white">{PHONE}</a>
          </p>
          <p className="text-xs">
            &copy; {new Date().getFullYear()} Blinds Crafter. All rights reserved. Licensed &amp; Insured in New Jersey.
          </p>
        </div>
      </footer>

      {/* ─── FLOATING MOBILE CTA (links to #contact, not tel) ─── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#BC4F35] shadow-2xl md:hidden"
        role="complementary"
        aria-label="Get a free consultation"
      >
        <a
          href="#contact"
          className="flex items-center justify-center gap-2 py-4 text-base font-bold text-white"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Get My Free Consultation
        </a>
      </div>
    </>
  );
}
