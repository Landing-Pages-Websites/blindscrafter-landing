"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import Image from "next/image";
import { useTracking } from "@/hooks/useTracking";
import { useMegaLeadForm } from "@/hooks/useMegaLeadForm";
import { formatPhone, isValidPhone } from "@/hooks/usePhoneValidation";

/* ─── Constants ─── */
const PHONE = "855-578-6788";
const PHONE_HREF = "tel:18555786788";
const CTA_TEXT = "Get My Free Consultation";

// TRACKING — siteKey updated after Mega Admin registration
const TRACKING = {
  siteKey: "PENDING_SITE_KEY",
  gtmId: "GTM-TWQQT5LF",
  pixelId: "894485915971225",
};

/* ─── Scroll Reveal Hook ─── */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Lead Form ─── */
function LeadForm({ inline = false }: { inline?: boolean }) {
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
    if (!firstName.trim()) e.firstName = "First name is required";
    if (!lastName.trim()) e.lastName = "Last name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Valid email required";
    if (!isValidPhone(phone)) e.phone = "Valid 10-digit phone required";
    if (!address.trim()) e.address = "Address is required";
    if (!windowsCount) e.windowsCount = "Please select number of windows";
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
      if (typeof window !== "undefined" && (window as any).dataLayer) {
        (window as any).dataLayer.push({ event: "lead_submitted", form_type: "consultation" });
      }
    } catch {
      setServerError("Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={`rounded-2xl bg-white p-8 text-center shadow-xl ${inline ? "" : "border border-gray-100"}`}>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900">You&apos;re all set!</h3>
        <p className="text-gray-600">Our team will call you within 24 hours to schedule your free in-home consultation. Can&apos;t wait? Call us now:</p>
        <a href={PHONE_HREF} className="mt-4 inline-block text-lg font-bold text-[#0f2340] underline">{PHONE}</a>
      </div>
    );
  }

  const inputCls = (field: string) =>
    `w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4920a] ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`rounded-2xl bg-white shadow-xl ${inline ? "p-6" : "p-6 lg:p-8"} space-y-4`}
      aria-label="Free consultation form"
    >
      <p className="text-center text-xs font-semibold uppercase tracking-wider text-[#d4920a]">
        🎁 Free Installation · BOGO Motorization · Free Smart Home Setup
      </p>
      <h2 className="text-center text-xl font-bold text-[#0f2340] leading-tight">
        Get Your Free In-Home Consultation
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className="mb-1 block text-xs font-medium text-gray-700">First Name *</label>
          <input id="firstName" type="text" autoComplete="given-name" value={firstName}
            onChange={(e) => setFirstName(e.target.value)} className={inputCls("firstName")} placeholder="Jane" />
          {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className="mb-1 block text-xs font-medium text-gray-700">Last Name *</label>
          <input id="lastName" type="text" autoComplete="family-name" value={lastName}
            onChange={(e) => setLastName(e.target.value)} className={inputCls("lastName")} placeholder="Smith" />
          {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-xs font-medium text-gray-700">Email Address *</label>
        <input id="email" type="email" autoComplete="email" value={email}
          onChange={(e) => setEmail(e.target.value)} className={inputCls("email")} placeholder="jane@email.com" />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-xs font-medium text-gray-700">Phone Number *</label>
        <input id="phone" type="tel" autoComplete="tel" value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))} className={inputCls("phone")} placeholder="(201) 555-0100" />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="address" className="mb-1 block text-xs font-medium text-gray-700">Home Address *</label>
        <input id="address" type="text" autoComplete="street-address" value={address}
          onChange={(e) => setAddress(e.target.value)} className={inputCls("address")} placeholder="123 Main St, Ridgewood, NJ" />
        {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
      </div>

      <div>
        <label htmlFor="windowsCount" className="mb-1 block text-xs font-medium text-gray-700">How many windows? *</label>
        <select id="windowsCount" value={windowsCount}
          onChange={(e) => setWindowsCount(e.target.value)} className={inputCls("windowsCount")}>
          <option value="">Select number of windows</option>
          <option value="1-5">1–5 windows</option>
          <option value="5-10">5–10 windows</option>
          <option value="10-15">10–15 windows</option>
          <option value="15+">15+ windows</option>
        </select>
        {errors.windowsCount && <p className="mt-1 text-xs text-red-500">{errors.windowsCount}</p>}
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="pulse-gold w-full rounded-xl bg-[#d4920a] py-4 text-base font-bold text-white shadow-lg transition hover:bg-[#b87c08] disabled:opacity-60"
      >
        {submitting ? "Submitting…" : CTA_TEXT}
      </button>

      <p className="text-center text-xs text-gray-400">
        No spam. We&apos;ll call within 24 hours to schedule. Or call us now:{" "}
        <a href={PHONE_HREF} className="font-semibold text-[#0f2340]">{PHONE}</a>
      </p>
    </form>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  useReveal();
  useTracking(TRACKING);

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
        className={`fixed top-0 z-50 w-full bg-[#0f2340] transition-shadow ${scrolled ? "header-shadow" : ""}`}
        role="banner"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
          <a href="/" aria-label="Blinds Crafter home">
            <Image
              src="/images/logo-white.webp"
              alt="Blinds Crafter logo"
              width={180}
              height={48}
              className="h-12 w-auto md:h-14 lg:h-16"
              priority
            />
          </a>
          <a
            href={PHONE_HREF}
            className="flex items-center gap-2 rounded-lg bg-[#d4920a] px-4 py-2 text-sm font-bold text-white shadow transition hover:bg-[#b87c08] md:text-base"
            aria-label={`Call Blinds Crafter at ${PHONE}`}
          >
            <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
            {PHONE}
          </a>
        </div>
      </header>

      <main>
        {/* ─── HERO + FORM (above fold) ─── */}
        <section
          id="hero"
          className="relative bg-[#0f2340] pt-24 pb-16 md:pt-28 md:pb-20"
          aria-label="Hero"
        >
          {/* subtle texture overlay */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-4">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              {/* Left — copy */}
              <div className="text-white">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#d4920a]/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#f0a90c]">
                  🏡 Northern NJ&apos;s Premium Window Treatment Specialists
                </div>
                <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-5xl">
                  Custom Blinds &amp; Shades — Installed{" "}
                  <span className="text-[#d4920a]">Free</span>
                </h1>
                <p className="mb-6 text-lg text-blue-100/90 leading-relaxed">
                  Upgrade your home with precision-crafted window treatments — from sleek motorized shades to timeless wood blinds. Every installation includes <strong className="text-white">free smart home integration</strong> (Alexa, Google Home, HomeKit) and free professional installation.
                </p>

                {/* Offer pills */}
                <ul className="mb-8 space-y-3" aria-label="Current offers">
                  {[
                    ["🎁", "Free Smart Home Integration", "Alexa · Google Home · HomeKit"],
                    ["2️⃣", "BOGO Free Motorization", "Buy motorization on one window, get the next free"],
                    ["🔧", "Free Professional Installation", "On all orders — no hidden fees"],
                    ["📋", "Free In-Home Consultation", "Same-week appointments available"],
                  ].map(([icon, title, sub]) => (
                    <li key={title} className="flex items-start gap-3">
                      <span className="text-xl leading-none mt-0.5">{icon}</span>
                      <span>
                        <span className="font-semibold text-white">{title}</span>
                        <span className="block text-sm text-blue-100/70">{sub}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Trust signals */}
                <div className="flex flex-wrap gap-4 text-sm text-blue-100/70">
                  <span className="flex items-center gap-1">⭐ 4.9 stars · 200+ reviews</span>
                  <span className="flex items-center gap-1">🏠 NJ-licensed &amp; insured</span>
                  <span className="flex items-center gap-1">📞 Same-day response</span>
                </div>
              </div>

              {/* Right — form */}
              <div id="contact" className="w-full">
                <LeadForm />
              </div>
            </div>
          </div>
        </section>

        {/* ─── SOCIAL PROOF BAND ─── */}
        <section
          id="social-proof"
          className="bg-white border-b border-gray-100 py-6"
          aria-label="Customer reviews"
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-center">
              {[
                { stat: "200+", label: "Happy NJ Homeowners" },
                { stat: "4.9★", label: "Average Google Rating" },
                { stat: "$0", label: "Installation Fee" },
                { stat: "15+", label: "Years Experience" },
              ].map(({ stat, label }) => (
                <div key={label} className="min-w-[100px]">
                  <div className="text-2xl font-extrabold text-[#0f2340]">{stat}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WINDOW BLINDS ─── */}
        <section
          id="window-blinds"
          className="bg-[#faf8f4] py-20"
          aria-labelledby="blinds-heading"
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="reveal grid gap-10 md:grid-cols-2 items-center">
              <div>
                <span className="mb-3 inline-block rounded-full bg-[#0f2340]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0f2340]">Premium Blinds</span>
                <h2 id="blinds-heading" className="mb-4 text-3xl font-extrabold text-[#0f2340] leading-tight">
                  Custom Window Blinds Built for NJ Homes
                </h2>
                <p className="mb-4 text-gray-600 leading-relaxed">
                  No two windows are alike — and your blinds shouldn&apos;t be either. We measure, craft, and install custom window blinds sized to the exact millimeter. Choose from real wood for warmth and character, faux wood for moisture-prone kitchens and baths, aluminum for sleek modern spaces, or vertical blinds for panoramic sliding doors.
                </p>
                <p className="mb-6 text-gray-600 leading-relaxed">
                  Every blind ships with professional installation included. Our team handles measurement, mounting, and finishing so you never deal with ill-fitting off-the-shelf products again. We stock styles for every interior — from transitional to contemporary — and our design consultants help you find the right look for each room.
                </p>
                <ul className="mb-6 space-y-2 text-sm text-gray-700">
                  {["Real Wood · Faux Wood · Aluminum · Vinyl blinds", "Blackout options for bedrooms", "Cordless & child-safe designs available", "Custom sizing for odd-shaped windows"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d4920a] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="inline-block rounded-xl bg-[#d4920a] px-6 py-3 font-bold text-white shadow hover:bg-[#b87c08] transition">
                  Get My Free Consultation →
                </a>
              </div>
              <div className="rounded-2xl bg-[#0f2340]/8 p-10 flex items-center justify-center min-h-[280px]">
                <div className="text-center text-[#0f2340]/40">
                  <svg className="mx-auto mb-3 h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18" />
                  </svg>
                  <p className="text-sm font-medium">Custom Window Blinds</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── WINDOW SHADES ─── */}
        <section
          id="window-shades"
          className="bg-white py-20"
          aria-labelledby="shades-heading"
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="reveal grid gap-10 md:grid-cols-2 items-center">
              <div className="order-2 md:order-1 rounded-2xl bg-[#faf8f4] p-10 flex items-center justify-center min-h-[280px]">
                <div className="text-center text-[#0f2340]/40">
                  <svg className="mx-auto mb-3 h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9h18M12 9v12" />
                  </svg>
                  <p className="text-sm font-medium">Designer Shades</p>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <span className="mb-3 inline-block rounded-full bg-[#0f2340]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0f2340]">Premium Shades</span>
                <h2 id="shades-heading" className="mb-4 text-3xl font-extrabold text-[#0f2340] leading-tight">
                  Designer Shades That Control Light &amp; Elevate Every Room
                </h2>
                <p className="mb-4 text-gray-600 leading-relaxed">
                  From the elegant drape of Roman shades to the clean roll of solar shades that preserve your view while blocking 90% of UV rays, our shade collection transforms the way light feels in your home. Cellular honeycomb shades add an insulating air pocket that keeps NJ winters warmer and summer bills lower.
                </p>
                <p className="mb-6 text-gray-600 leading-relaxed">
                  Zebra shades let you dial from full transparency to complete privacy — perfect for living rooms where you want flexibility throughout the day. Woven wood and bamboo shades bring natural texture to modern interiors. Every shade is custom-cut to your window dimensions and arrives ready for our team to install.
                </p>
                <ul className="mb-6 space-y-2 text-sm text-gray-700">
                  {["Roller · Roman · Solar · Sheer · Zebra · Cellular", "UV-blocking and privacy options", "Energy-efficient honeycomb designs", "Fabric options for every design style"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d4920a] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="inline-block rounded-xl bg-[#d4920a] px-6 py-3 font-bold text-white shadow hover:bg-[#b87c08] transition">
                  Get My Free Consultation →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── MOTORIZED TREATMENTS ─── */}
        <section
          id="motorized-treatments"
          className="bg-[#0f2340] py-20"
          aria-labelledby="motorized-heading"
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="reveal text-center mb-12">
              <span className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#d4920a]">BOGO Free Motorization</span>
              <h2 id="motorized-heading" className="mb-4 text-3xl font-extrabold text-white leading-tight">
                Motorized Window Treatments — Effortless Control, Every Day
              </h2>
              <p className="mx-auto max-w-2xl text-blue-100/80 leading-relaxed">
                Motorized blinds and shades are no longer a luxury reserved for custom homes — they&apos;re a practical upgrade that pays for itself in convenience. Control your window treatments from your phone, your remote, or your voice. Schedule them to open at sunrise and close at sunset automatically.
              </p>
            </div>
            <div className="reveal grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Remote &amp; App Control",
                  body: "Operate every blind and shade in your home from a single app or remote. No more reaching behind furniture for a cord — one tap covers every window.",
                  icon: "📱",
                },
                {
                  title: "Schedule &amp; Automate",
                  body: "Program your shades to open with the sunrise and close at dusk. Automated schedules protect your furniture from UV fading while keeping your home comfortable all day.",
                  icon: "⏰",
                },
                {
                  title: "Silent Motor Technology",
                  body: "Our motorized systems use whisper-quiet motors that won&apos;t disrupt your home&apos;s ambiance. They&apos;re also battery-powered — no electrical rewiring required on most installations.",
                  icon: "🔇",
                },
              ].map(({ title, body, icon }) => (
                <div key={title} className="rounded-2xl bg-white/10 p-6 text-white">
                  <div className="mb-3 text-3xl">{icon}</div>
                  <h3 className="mb-2 text-lg font-bold" dangerouslySetInnerHTML={{ __html: title }} />
                  <p className="text-sm text-blue-100/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: body }} />
                </div>
              ))}
            </div>
            <div className="reveal mt-10 text-center">
              <div className="inline-block rounded-2xl bg-[#d4920a] px-6 py-4 text-white shadow-lg">
                <p className="text-sm font-semibold uppercase tracking-wider mb-1">Limited Time Offer</p>
                <p className="text-xl font-extrabold">Buy Motorization on 1 Window — Get the Next FREE</p>
              </div>
              <div className="mt-6">
                <a href="#contact" className="inline-block rounded-xl border-2 border-white px-8 py-3 font-bold text-white transition hover:bg-white hover:text-[#0f2340]">
                  Claim My BOGO Deal →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SMART HOME INTEGRATION ─── */}
        <section
          id="smart-home-integration"
          className="bg-[#faf8f4] py-20"
          aria-labelledby="smart-home-heading"
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="reveal grid gap-10 md:grid-cols-2 items-center">
              <div>
                <span className="mb-3 inline-block rounded-full bg-[#0f2340]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0f2340]">Free Smart Home Integration</span>
                <h2 id="smart-home-heading" className="mb-4 text-3xl font-extrabold text-[#0f2340] leading-tight">
                  Alexa, Google Home &amp; HomeKit — Included Free
                </h2>
                <p className="mb-4 text-gray-600 leading-relaxed">
                  Every motorized window treatment we install comes with complimentary smart home integration — no extra charge. That means your new blinds and shades work seamlessly with Alexa, Google Home, and Apple HomeKit right from day one.
                </p>
                <p className="mb-6 text-gray-600 leading-relaxed">
                  Tell Alexa to &quot;close the bedroom shades&quot; or set a Google Home routine that lowers your living room blinds when your smart thermostat senses the afternoon sun. Group all your window treatments into scenes and control an entire floor with a single command. Our certified technicians handle the full setup — you just walk into a smarter home.
                </p>
                <div className="mb-6 grid grid-cols-3 gap-4">
                  {[
                    { name: "Amazon Alexa", color: "#00CAFF" },
                    { name: "Google Home", color: "#4285F4" },
                    { name: "Apple HomeKit", color: "#555555" },
                  ].map(({ name, color }) => (
                    <div key={name} className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                      <div className="mb-2 text-2xl">🏠</div>
                      <p className="text-xs font-semibold text-gray-700">{name}</p>
                    </div>
                  ))}
                </div>
                <a href="#contact" className="inline-block rounded-xl bg-[#d4920a] px-6 py-3 font-bold text-white shadow hover:bg-[#b87c08] transition">
                  Get Free Smart Home Setup →
                </a>
              </div>
              <div className="rounded-2xl bg-[#0f2340] p-10 text-center text-white">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-bold mb-2">Your Home, Fully Connected</h3>
                <p className="text-sm text-blue-100/80">Voice control · App scheduling · Scene automation · Energy savings</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── WHY US / TRUST STACK ─── */}
        <section
          id="why-blinds-crafter"
          className="bg-white py-20"
          aria-labelledby="why-heading"
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="reveal text-center mb-12">
              <h2 id="why-heading" className="mb-3 text-3xl font-extrabold text-[#0f2340]">
                Why NJ Homeowners Choose Blinds Crafter
              </h2>
              <p className="mx-auto max-w-xl text-gray-500">
                We&apos;re not a big-box retailer. We&apos;re a local NJ team that has been transforming homes in Ridgewood, Paramus, Montclair, and beyond for over a decade.
              </p>
            </div>
            <div className="reveal grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: "📐",
                  title: "Precision Custom Fit",
                  body: "Every product is measured and cut to your exact window dimensions. No gaps, no guessing, no returns. We measure, you approve, we install.",
                },
                {
                  icon: "🔧",
                  title: "Free Professional Installation",
                  body: "Our certified installers handle everything from mounting hardware to final leveling. You never touch a drill or a level — and installation is always included at no extra cost.",
                },
                {
                  icon: "⭐",
                  title: "4.9-Star Service",
                  body: "Over 200 NJ homeowners have trusted us with their windows. Our 4.9-star Google rating reflects the care we bring to every project, start to finish.",
                },
                {
                  icon: "🏠",
                  title: "Local NJ Team",
                  body: "We&apos;re based right here in Northern NJ — Carlstadt, to be exact. Same-week appointments, fast follow-through, and a team that treats your home like their own.",
                },
                {
                  icon: "🛡️",
                  title: "Licensed &amp; Insured",
                  body: "Fully licensed and insured in New Jersey. Every installation is backed by our workmanship guarantee — if anything isn&apos;t right, we come back and fix it.",
                },
                {
                  icon: "💰",
                  title: "Direct Manufacturer Pricing",
                  body: "We work directly with manufacturers to eliminate middlemen and unnecessary markups. Premium custom products at prices that make sense for your budget.",
                },
              ].map(({ icon, title, body }) => (
                <div key={title} className="rounded-2xl border border-gray-100 bg-[#faf8f4] p-6 shadow-sm">
                  <div className="mb-3 text-3xl">{icon}</div>
                  <h3 className="mb-2 text-base font-bold text-[#0f2340]" dangerouslySetInnerHTML={{ __html: title }} />
                  <p className="text-sm text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: body }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section
          id="testimonials"
          className="bg-[#0f2340] py-20"
          aria-labelledby="testimonials-heading"
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="reveal text-center mb-12">
              <h2 id="testimonials-heading" className="mb-3 text-3xl font-extrabold text-white">
                What Our Customers Say
              </h2>
              <div className="flex justify-center gap-1 text-[#d4920a]" aria-label="4.9 out of 5 stars">
                {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                <span className="ml-2 text-sm text-blue-100/70">4.9 · 200+ Reviews</span>
              </div>
            </div>
            <div className="reveal grid gap-6 md:grid-cols-3">
              {[
                {
                  quote: "Blinds Crafter transformed every room in our home. The motorized shades connect seamlessly to our Alexa and the installation was flawless. I can't believe installation was free — the value is unbeatable.",
                  name: "Sarah M.",
                  location: "Ridgewood, NJ",
                },
                {
                  quote: "We got the BOGO motorization deal and it saved us over $800. The team was on time, professional, and the blinds fit perfectly. Our home looks like it belongs in a magazine now.",
                  name: "David &amp; Karen L.",
                  location: "Paramus, NJ",
                },
                {
                  quote: "From the consultation to installation, every step was smooth. They set up our HomeKit integration in 20 minutes and walked us through everything. Exceptional service from a local NJ company.",
                  name: "Michael T.",
                  location: "Montclair, NJ",
                },
              ].map(({ quote, name, location }) => (
                <div key={name} className="rounded-2xl bg-white/10 p-6 text-white">
                  <div className="mb-3 text-[#d4920a]">★★★★★</div>
                  <p className="mb-4 text-sm leading-relaxed text-blue-100/90 italic">&ldquo;{quote}&rdquo;</p>
                  <p className="font-semibold" dangerouslySetInnerHTML={{ __html: name }} />
                  <p className="text-xs text-blue-100/60">{location}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CONTACT / BOTTOM FORM ─── */}
        <section
          id="get-started"
          className="bg-[#faf8f4] py-20"
          aria-labelledby="cta-heading"
        >
          <div className="mx-auto max-w-2xl px-4">
            <div className="reveal text-center mb-8">
              <h2 id="cta-heading" className="mb-3 text-3xl font-extrabold text-[#0f2340]">
                Ready to Transform Your Windows?
              </h2>
              <p className="text-gray-600">
                Book your free in-home consultation today. We&apos;ll bring samples, take measurements, and give you a custom quote — no pressure, no obligation.
              </p>
            </div>
            <div className="reveal">
              <LeadForm inline />
            </div>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#091828] py-10 text-center text-sm text-blue-100/50" role="contentinfo">
        <div className="mx-auto max-w-4xl px-4">
          <Image
            src="/images/logo-white.webp"
            alt="Blinds Crafter"
            width={140}
            height={38}
            className="mx-auto mb-4 h-10 w-auto opacity-80"
          />
          <p className="mb-1">414 Hackensack St, Carlstadt, NJ 07072</p>
          <p className="mb-4">
            <a href={PHONE_HREF} className="text-blue-100/70 hover:text-white transition">{PHONE}</a>
          </p>
          <p className="text-xs">
            © {new Date().getFullYear()} Blinds Crafter. All rights reserved. Licensed &amp; Insured in New Jersey.
          </p>
        </div>
      </footer>

      {/* ─── FLOATING MOBILE CTA ─── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#d4920a] shadow-2xl"
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
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {CTA_TEXT} — Free
        </a>
      </div>
    </>
  );
}
