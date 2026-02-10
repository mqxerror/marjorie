'use client';

import { useState, useRef, useEffect, useCallback, FormEvent } from 'react';
import { SectionWrapper } from '@/components/shared/SectionWrapper';
import { SECTION_IDS, API_URL } from '@/lib/constants';
import { trackGA4Event, trackFBEvent } from '@/lib/analytics';
import { CheckCircle, AlertTriangle, Info, Lock, Clock, Mail, Check } from 'lucide-react';

// ── Session data ──────────────────────────────────────────────

const dubaiInPerson = [
  'Saturday, February 21, 2026 | 3:00 PM – 5:00 PM | Dubai (In-Person)',
  'Saturday, February 21, 2026 | 7:00 PM – 9:00 PM | Dubai (In-Person)',
  'Sunday, February 22, 2026 | 3:00 PM – 5:00 PM | Dubai (In-Person)',
  'Sunday, February 22, 2026 | 7:00 PM – 9:00 PM | Dubai (In-Person)',
];

const abuDhabiInPerson = [
  'Saturday, February 28, 2026 | 3:00 PM – 5:00 PM | Abu Dhabi (In-Person)',
  'Saturday, February 28, 2026 | 7:00 PM – 9:00 PM | Abu Dhabi (In-Person)',
  'Sunday, March 1, 2026 | 3:00 PM – 5:00 PM | Abu Dhabi (In-Person)',
  'Sunday, March 1, 2026 | 7:00 PM – 9:00 PM | Abu Dhabi (In-Person)',
];

const onlineSessions = [
  'Saturday, February 21, 2026 | 3:00 PM – 5:00 PM | Online',
  'Saturday, February 21, 2026 | 7:00 PM – 9:00 PM | Online',
  'Sunday, February 22, 2026 | 3:00 PM – 5:00 PM | Online',
  'Sunday, February 22, 2026 | 7:00 PM – 9:00 PM | Online',
  'Saturday, February 28, 2026 | 3:00 PM – 5:00 PM | Online',
  'Saturday, February 28, 2026 | 7:00 PM – 9:00 PM | Online',
  'Sunday, March 1, 2026 | 3:00 PM – 5:00 PM | Online',
  'Sunday, March 1, 2026 | 7:00 PM – 9:00 PM | Online',
];

const caregivingOptions = [
  'Home health care',
  'Caregiving / elderly care',
  'Domestic support with caregiving duties',
  'No prior caregiving experience, but willing and able to perform caregiving or support roles',
];

const STORAGE_KEY = 'eb3-screening-form';
const STORAGE_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

const SECTION_NAMES = [
  'Basic Information',
  'Eligibility & Background',
  'Expectation Setting',
  'Session Selection',
  'Final Acknowledgment',
];

// ── Inline error component ───────────────────────────────────

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="text-red-600 text-xs mt-1">
      {error}
    </p>
  );
}

// ── Component ─────────────────────────────────────────────────

export function ScreeningForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Section 1
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [otherCity, setOtherCity] = useState('');

  // Section 2
  const [nationality, setNationality] = useState('');
  const [uaeResident, setUaeResident] = useState('');
  const [caregivingExperience, setCaregivingExperience] = useState<string[]>([]);
  const [willingToWork, setWillingToWork] = useState('');
  const [willingToDrive, setWillingToDrive] = useState('');

  // Section 3
  const [acceptsTimeframe, setAcceptsTimeframe] = useState('');
  const [seeksPermanentRelocation, setSeeksPermanentRelocation] = useState('');
  const [understandsInfoOnly, setUnderstandsInfoOnly] = useState('');
  const [acceptsFinancialCosts, setAcceptsFinancialCosts] = useState('');

  // Section 4
  const [attendanceMode, setAttendanceMode] = useState('');
  const [selectedSession, setSelectedSession] = useState('');

  // Section 5
  const [acknowledgedAccuracy, setAcknowledgedAccuracy] = useState(false);

  // Inline validation state
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Early duplicate email check
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Progress indicator
  const [currentSection, setCurrentSection] = useState(0);
  const sectionRefs = useRef<(HTMLFieldSetElement | null)[]>([]);

  // Draft restoration
  const [showDraftBanner, setShowDraftBanner] = useState(false);

  // Refs for focus management
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Screen reader progress announcement
  const [srProgressText, setSrProgressText] = useState('');

  // ── Restore from sessionStorage on mount ──
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const d = JSON.parse(saved);

      // Check expiry
      if (d._savedAt && Date.now() - d._savedAt > STORAGE_EXPIRY_MS) {
        sessionStorage.removeItem(STORAGE_KEY);
        return;
      }

      // Check if any real data exists
      const hasData = d.fullName || d.mobileNumber || d.email || d.nationality || d.attendanceMode;
      if (!hasData) return;

      if (d.fullName) setFullName(d.fullName);
      if (d.mobileNumber) setMobileNumber(d.mobileNumber);
      if (d.email) setEmail(d.email);
      if (d.currentCity) setCurrentCity(d.currentCity);
      if (d.otherCity) setOtherCity(d.otherCity);
      if (d.nationality) setNationality(d.nationality);
      if (d.uaeResident) setUaeResident(d.uaeResident);
      if (d.caregivingExperience) setCaregivingExperience(d.caregivingExperience);
      if (d.willingToWork) setWillingToWork(d.willingToWork);
      if (d.willingToDrive) setWillingToDrive(d.willingToDrive);
      if (d.acceptsTimeframe) setAcceptsTimeframe(d.acceptsTimeframe);
      if (d.seeksPermanentRelocation) setSeeksPermanentRelocation(d.seeksPermanentRelocation);
      if (d.understandsInfoOnly) setUnderstandsInfoOnly(d.understandsInfoOnly);
      if (d.acceptsFinancialCosts) setAcceptsFinancialCosts(d.acceptsFinancialCosts);
      if (d.attendanceMode) setAttendanceMode(d.attendanceMode);
      if (d.selectedSession) setSelectedSession(d.selectedSession);
      // NOTE: acknowledgedAccuracy is NOT restored — consent must be active each session

      setShowDraftBanner(true);
    } catch {
      // Ignore parse errors
    }
  }, []);

  // ── Save to sessionStorage (debounced) — excludes consent ──
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            fullName, mobileNumber, email, currentCity, otherCity,
            nationality, uaeResident, caregivingExperience, willingToWork, willingToDrive,
            acceptsTimeframe, seeksPermanentRelocation, understandsInfoOnly, acceptsFinancialCosts,
            attendanceMode, selectedSession,
            _savedAt: Date.now(),
          }),
        );
      } catch {
        // Storage full or unavailable
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [
    fullName, mobileNumber, email, currentCity, otherCity,
    nationality, uaeResident, caregivingExperience, willingToWork, willingToDrive,
    acceptsTimeframe, seeksPermanentRelocation, understandsInfoOnly, acceptsFinancialCosts,
    attendanceMode, selectedSession,
  ]);

  // ── beforeunload guard ──
  useEffect(() => {
    const hasData = fullName || mobileNumber || email || nationality;
    if (!hasData || submitted) return;

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [fullName, mobileNumber, email, nationality, submitted]);

  // ── IntersectionObserver for progress indicator ──
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sectionRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setCurrentSection(i);
            setSrProgressText(`Section ${i + 1} of ${SECTION_NAMES.length}: ${SECTION_NAMES[i]}`);
          }
        },
        { threshold: 0.2, rootMargin: '-80px 0px -40% 0px' },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // Focus success message when submitted
  useEffect(() => {
    if (submitted) {
      successRef.current?.focus();
      document.getElementById(SECTION_IDS.screeningForm)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [submitted]);

  function handleCaregivingToggle(option: string) {
    setCaregivingExperience((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option],
    );
  }

  function handleClearForm() {
    setFullName(''); setMobileNumber(''); setEmail(''); setCurrentCity(''); setOtherCity('');
    setNationality(''); setUaeResident(''); setCaregivingExperience([]); setWillingToWork(''); setWillingToDrive('');
    setAcceptsTimeframe(''); setSeeksPermanentRelocation(''); setUnderstandsInfoOnly(''); setAcceptsFinancialCosts('');
    setAttendanceMode(''); setSelectedSession(''); setAcknowledgedAccuracy(false);
    setTouched({}); setFieldErrors({}); setEmailExists(false); setError('');
    setShowDraftBanner(false);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
  }

  // ── Per-field validation ──
  const validateField = useCallback(
    (field: string): string => {
      switch (field) {
        case 'fullName':
          return !fullName.trim() ? 'Full name is required.' : '';
        case 'mobileNumber':
          return !mobileNumber.trim() ? 'Mobile number is required.' : '';
        case 'email':
          if (!email.trim()) return 'Email address is required.';
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
          return '';
        case 'currentCity':
          return !currentCity && !otherCity.trim() ? 'Current city is required.' : '';
        case 'otherCity':
          return currentCity === 'Other' && !otherCity.trim() ? 'Please specify your city.' : '';
        default:
          return '';
      }
    },
    [fullName, mobileNumber, email, currentCity, otherCity],
  );

  // ── Early duplicate email check (debounced) ──
  useEffect(() => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailExists(false);
      return;
    }
    setCheckingEmail(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/api/applications/check-email?email=${encodeURIComponent(email.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setEmailExists(data.exists);
        }
      } catch {
        // Silently fail — submit will catch the 409
      } finally {
        setCheckingEmail(false);
      }
    }, 600);
    return () => { clearTimeout(timer); setCheckingEmail(false); };
  }, [email]);

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field);
    setFieldErrors((prev) => ({ ...prev, [field]: err }));
  }

  function validate(): string | null {
    if (!fullName.trim()) return 'Full name is required.';
    if (!mobileNumber.trim()) return 'Mobile number is required.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return 'A valid email address is required.';
    if (!currentCity && !otherCity.trim()) return 'Current city is required.';
    if (currentCity === 'Other' && !otherCity.trim()) return 'Please specify your city.';
    if (!nationality) return 'Nationality is required.';
    if (!uaeResident) return 'UAE residency status is required.';
    if (caregivingExperience.length === 0) return 'Please select at least one caregiving experience option.';
    if (!willingToWork) return 'Please indicate willingness to work in caregiving.';
    if (!willingToDrive) return 'Please indicate willingness to drive.';
    if (!acceptsTimeframe) return 'Please respond to the timeframe question.';
    if (!seeksPermanentRelocation) return 'Please respond to the permanent relocation question.';
    if (!understandsInfoOnly) return 'Please respond to the informational session question.';
    if (!acceptsFinancialCosts) return 'Please respond to the financial expectations question.';
    if (!attendanceMode) return 'Please select an attendance mode.';
    if (!selectedSession) return 'Please select a session.';
    if (!acknowledgedAccuracy) return 'Please confirm the accuracy of your information.';
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    // Mark all text fields as touched for inline errors
    const allFields = ['fullName', 'mobileNumber', 'email', 'currentCity', 'otherCity'];
    const newTouched: Record<string, boolean> = {};
    const newErrors: Record<string, string> = {};
    allFields.forEach((f) => {
      newTouched[f] = true;
      newErrors[f] = validateField(f);
    });
    setTouched((prev) => ({ ...prev, ...newTouched }));
    setFieldErrors((prev) => ({ ...prev, ...newErrors }));

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setTimeout(() => {
        errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorRef.current?.focus();
      }, 50);
      return;
    }

    setSubmitting(true);

    try {
      const body = {
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        email: email.trim().toLowerCase(),
        currentCity: currentCity === 'Other' ? otherCity.trim() : currentCity,
        nationality: nationality.toLowerCase(),
        uaeResident: uaeResident === 'yes',
        caregivingExperience,
        willingToWork: willingToWork === 'yes',
        willingToDrive: willingToDrive === 'yes',
        acceptsTimeframe: acceptsTimeframe === 'yes',
        seeksPermanentRelocation: seeksPermanentRelocation === 'yes',
        understandsInfoOnly: understandsInfoOnly === 'yes',
        acceptsFinancialCosts: acceptsFinancialCosts === 'yes',
        attendanceMode: attendanceMode === 'in-person' ? 'IN_PERSON' : 'ONLINE',
        selectedSession,
        acknowledgedAccuracy,
      };

      const res = await fetch(`${API_URL}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = data?.message;
        const errorText = Array.isArray(msg) ? msg[0] : (msg || 'Submission failed. Please try again.');
        throw new Error(errorText);
      }

      // Clear saved form on success
      try { sessionStorage.removeItem(STORAGE_KEY); } catch {}

      setSubmitted(true);

      trackGA4Event('form_submission', {
        form_name: 'screening_application',
        attendance_mode: body.attendanceMode,
      });
      trackFBEvent('CompleteRegistration', {
        content_name: 'Screening Application',
        status: true,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      setTimeout(() => {
        errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorRef.current?.focus();
      }, 50);
    } finally {
      setSubmitting(false);
    }
  }

  function scrollToSection(index: number) {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── Success state ──

  if (submitted) {
    return (
      <SectionWrapper id={SECTION_IDS.screeningForm}>
        <div
          ref={successRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="max-w-2xl mx-auto text-center py-12 outline-none"
        >
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 sm:p-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-dark-text mb-3">
              Thank You — You Have Taken an Important Step
            </h2>
            <p className="text-dark-text/70 text-lg mb-8">
              Your application has been received. If your profile matches the focus of this session,
              you will receive a manual confirmation with further details.
            </p>

            <div className="space-y-4 text-left max-w-md mx-auto mb-8">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-dark-text/40 shrink-0 mt-0.5" />
                <p className="text-dark-text/60 text-sm">
                  Applications are reviewed within 2–3 business days. Confirmed attendees will
                  be contacted directly.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-dark-text/40 shrink-0 mt-0.5" />
                <p className="text-dark-text/60 text-sm">
                  Please check your email (including spam/promotions) for any follow-up
                  communications from our team.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-dark-text/40 shrink-0 mt-0.5" />
                <p className="text-dark-text/60 text-sm">
                  Your information is kept strictly confidential and will only be shared with the
                  session facilitators.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-dark-text/50 text-sm font-medium">What to do next:</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="/"
                  className="inline-block px-8 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-navy/90 transition-colors"
                >
                  Return to Home
                </a>
                <a
                  href="https://wa.me/971501234567?text=Hello%2C%20I%20just%20submitted%20my%20EB-3%20application."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Message Us on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  // ── Form ──

  return (
    <SectionWrapper id={SECTION_IDS.screeningForm} trackView>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          Apply to Attend the Information Session
        </h2>
        <p className="text-center text-dark-text/70 mb-10">
          Please complete this form to apply to attend an informational session about
          long-term, employment-based U.S. immigration pathways. Submission of this form
          does not guarantee attendance. Applications are reviewed to confirm relevance.
        </p>

        {/* ── Draft restoration banner ── */}
        {showDraftBanner && (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-blue-800 text-sm">
              We restored your previous progress. You can continue where you left off.
            </p>
            <button
              type="button"
              onClick={handleClearForm}
              className="text-blue-600 text-sm font-medium underline hover:text-blue-800 shrink-0 ml-3"
            >
              Start over
            </button>
          </div>
        )}

        {/* ── Screen reader progress announcement ── */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {srProgressText}
        </div>

        {/* ── Progress indicator ── */}
        <div className="sticky top-16 z-10 bg-light-gray/95 backdrop-blur-sm border-b border-dark-text/10 py-3 px-4 -mx-4 mb-8 rounded-lg" role="navigation" aria-label="Form progress">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {SECTION_NAMES.map((name, i) => (
              <button
                key={name}
                type="button"
                onClick={() => scrollToSection(i)}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
                aria-label={`Go to section ${i + 1}: ${name}${i < currentSection ? ' (completed)' : i === currentSection ? ' (current)' : ''}`}
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all flex items-center justify-center text-sm sm:text-base font-bold ${
                    i < currentSection
                      ? 'bg-green-500 text-white'
                      : i === currentSection
                        ? 'bg-gold text-white ring-4 ring-gold/25'
                        : 'bg-white border-2 border-dark-text/20 text-dark-text/30'
                  }`}
                >
                  {i < currentSection ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={3} />
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-[10px] sm:text-xs leading-tight text-center max-w-[4rem] sm:max-w-none transition-colors group-hover:text-dark-text ${
                  i === currentSection ? 'text-dark-text font-semibold' : i < currentSection ? 'text-green-600 font-medium' : 'text-dark-text/40'
                }`}>
                  {name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* ── Section 1: Basic Information ── */}
          <fieldset className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sm:p-8 space-y-6" ref={(el) => { sectionRefs.current[0] = el; }}>
            <legend className="text-lg sm:text-xl font-bold text-slate-900 pb-1 w-full">
              Section 1 — Basic Information
            </legend>
            <p className="text-dark-text/50 text-sm !mt-0 mb-4">
              Let us know who you are so we can confirm your identity.
            </p>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-dark-text mb-1">
                Full Name (as written on passport) <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); if (touched.fullName) { const err = validateField('fullName'); setFieldErrors(prev => ({ ...prev, fullName: err })); } }}
                onBlur={() => handleBlur('fullName')}
                autoComplete="name"
                autoCapitalize="words"
                aria-required="true"
                aria-invalid={touched.fullName && !!fieldErrors.fullName}
                aria-describedby={touched.fullName && fieldErrors.fullName ? 'fullName-error' : undefined}
                className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all bg-white ${
                  touched.fullName && fieldErrors.fullName ? 'border-red-400' : 'border-dark-text/20'
                }`}
              />
              {touched.fullName && <FieldError id="fullName-error" error={fieldErrors.fullName} />}
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-dark-text mb-1">
                Mobile Number (WhatsApp preferred) <span className="text-red-500">*</span>
              </label>
              <input
                id="mobileNumber"
                type="tel"
                required
                placeholder="+971"
                inputMode="tel"
                autoComplete="tel"
                value={mobileNumber}
                onChange={(e) => {
                  // Auto-format: allow digits, +, spaces, hyphens, parens
                  const raw = e.target.value.replace(/[^\d+\s\-()]/g, '');
                  setMobileNumber(raw);
                  if (touched.mobileNumber) { const err = validateField('mobileNumber'); setFieldErrors(prev => ({ ...prev, mobileNumber: err })); }
                }}
                onBlur={() => handleBlur('mobileNumber')}
                aria-required="true"
                aria-invalid={touched.mobileNumber && !!fieldErrors.mobileNumber}
                aria-describedby={touched.mobileNumber && fieldErrors.mobileNumber ? 'mobileNumber-error' : undefined}
                className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all bg-white ${
                  touched.mobileNumber && fieldErrors.mobileNumber ? 'border-red-400' : 'border-dark-text/20'
                }`}
              />
              {touched.mobileNumber && <FieldError id="mobileNumber-error" error={fieldErrors.mobileNumber} />}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailExists(false); if (touched.email) { const err = validateField('email'); setFieldErrors(prev => ({ ...prev, email: err })); } }}
                onBlur={() => handleBlur('email')}
                aria-required="true"
                aria-invalid={(touched.email && !!fieldErrors.email) || emailExists}
                aria-describedby={
                  emailExists ? 'email-duplicate' :
                  touched.email && fieldErrors.email ? 'email-error' : undefined
                }
                className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all bg-white ${
                  (touched.email && fieldErrors.email) || emailExists ? 'border-red-400' : 'border-dark-text/20'
                }`}
              />
              {checkingEmail && (
                <p className="mt-1 text-sm text-dark-text/50 flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 border-2 border-dark-text/30 border-t-navy rounded-full animate-spin" />
                  Checking email...
                </p>
              )}
              {touched.email && <FieldError id="email-error" error={fieldErrors.email} />}
              {emailExists && (
                <div id="email-duplicate" className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-amber-800 text-sm">
                    It looks like you have already applied with this email. If you need to update
                    your application, please reach out to us on WhatsApp or email and we will be happy to help.
                  </p>
                </div>
              )}
            </div>

            <div>
              <span className="block text-sm font-medium text-dark-text mb-2" id="currentCity-label">
                Current City in the UAE <span className="text-red-500">*</span>
              </span>
              <div className="space-y-2" role="radiogroup" aria-labelledby="currentCity-label">
                {['Dubai', 'Abu Dhabi', 'Sharjah', 'Other'].map((city) => (
                  <label key={city} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                    <input
                      type="radio"
                      name="currentCity"
                      value={city}
                      checked={currentCity === city}
                      onChange={(e) => {
                        setCurrentCity(e.target.value);
                        if (city !== 'Other') setOtherCity('');
                      }}
                      className="w-5 h-5 text-gold accent-gold"
                    />
                    <span className="text-dark-text/80">{city}</span>
                  </label>
                ))}
                {currentCity === 'Other' && (
                  <input
                    type="text"
                    placeholder="Please specify your city"
                    value={otherCity}
                    onChange={(e) => { setOtherCity(e.target.value); if (touched.otherCity) { const err = validateField('otherCity'); setFieldErrors(prev => ({ ...prev, otherCity: err })); } }}
                    onBlur={() => handleBlur('otherCity')}
                    aria-invalid={touched.otherCity && !!fieldErrors.otherCity}
                    aria-describedby={touched.otherCity && fieldErrors.otherCity ? 'otherCity-error' : undefined}
                    className={`ml-8 w-full max-w-xs px-4 py-2 text-base border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all bg-white text-sm ${
                      touched.otherCity && fieldErrors.otherCity ? 'border-red-400' : 'border-dark-text/20'
                    }`}
                  />
                )}
                {currentCity === 'Other' && touched.otherCity && <FieldError id="otherCity-error" error={fieldErrors.otherCity} />}
              </div>
            </div>
          </fieldset>

          {/* ── Section 2: Eligibility & Background ── */}
          <fieldset className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sm:p-8 space-y-6" ref={(el) => { sectionRefs.current[1] = el; }}>
            <legend className="text-lg sm:text-xl font-bold text-slate-900 pb-1 w-full">
              Section 2 — Eligibility & Background
            </legend>
            <p className="text-dark-text/50 text-sm !mt-0 mb-4">
              This helps us understand your background and ensure this session is relevant to you.
            </p>

            <div>
              <span className="block text-sm font-medium text-dark-text mb-2" id="nationality-label">
                Nationality <span className="text-red-500">*</span>
              </span>
              <div className="space-y-2" role="radiogroup" aria-labelledby="nationality-label">
                {['Filipino', 'Other'].map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                    <input
                      type="radio"
                      name="nationality"
                      value={opt}
                      checked={nationality === opt}
                      onChange={(e) => setNationality(e.target.value)}
                      className="w-5 h-5 text-gold accent-gold"
                    />
                    <span className="text-dark-text/80">{opt}</span>
                  </label>
                ))}
              </div>
              {nationality === 'Other' && (
                <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-amber-800 text-sm">
                    Thank you for your interest. This session is currently focused on a specific workforce group.
                  </p>
                </div>
              )}
            </div>

            <div>
              <span className="block text-sm font-medium text-dark-text mb-2" id="uaeResident-label">
                Are you currently residing in the UAE? <span className="text-red-500">*</span>
              </span>
              <div className="space-y-2" role="radiogroup" aria-labelledby="uaeResident-label">
                {['yes', 'no'].map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                    <input type="radio" name="uaeResident" value={opt} checked={uaeResident === opt}
                      onChange={(e) => setUaeResident(e.target.value)} className="w-5 h-5 text-gold accent-gold" />
                    <span className="text-dark-text/80">{opt === 'yes' ? 'Yes' : 'No'}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium text-dark-text mb-2" id="caregiving-label">
                Caregiving / Support Experience (select all that apply) <span className="text-red-500">*</span>
              </span>
              <div className="space-y-2" role="group" aria-labelledby="caregiving-label">
                {caregivingOptions.map((opt) => (
                  <label key={opt} className="flex items-start gap-3 cursor-pointer min-h-[44px]">
                    <input type="checkbox" checked={caregivingExperience.includes(opt)}
                      onChange={() => handleCaregivingToggle(opt)} className="w-5 h-5 text-gold accent-gold mt-0.5" />
                    <span className="text-dark-text/80 text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium text-dark-text mb-2" id="willingToWork-label">
                Are you willing and able to work in home health care or caregiving roles if sponsored
                by a U.S. employer in the future? <span className="text-red-500">*</span>
              </span>
              <div className="space-y-2" role="radiogroup" aria-labelledby="willingToWork-label">
                {['yes', 'no'].map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                    <input type="radio" name="willingToWork" value={opt} checked={willingToWork === opt}
                      onChange={(e) => setWillingToWork(e.target.value)} className="w-5 h-5 text-gold accent-gold" />
                    <span className="text-dark-text/80">{opt === 'yes' ? 'Yes' : 'No'}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium text-dark-text mb-2" id="willingToDrive-label">
                Are you able and willing to drive a vehicle as part of home health or caregiving
                work (subject to licensing requirements)? <span className="text-red-500">*</span>
              </span>
              <div className="space-y-2" role="radiogroup" aria-labelledby="willingToDrive-label">
                {['yes', 'no'].map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                    <input type="radio" name="willingToDrive" value={opt} checked={willingToDrive === opt}
                      onChange={(e) => setWillingToDrive(e.target.value)} className="w-5 h-5 text-gold accent-gold" />
                    <span className="text-dark-text/80">{opt === 'yes' ? 'Yes' : 'No'}</span>
                  </label>
                ))}
              </div>
              {willingToDrive === 'no' && (
                <div className="mt-3 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-blue-800 text-sm">
                    Driving is often a requirement for home health care positions in the United States.
                    This may affect your eligibility for certain roles.
                  </p>
                </div>
              )}
            </div>
          </fieldset>

          {/* ── Section 3: Expectation Setting ── */}
          <fieldset className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sm:p-8 space-y-6" ref={(el) => { sectionRefs.current[2] = el; }}>
            <legend className="text-lg sm:text-xl font-bold text-slate-900 pb-1 w-full">
              Section 3 — Expectation Setting
            </legend>
            <p className="text-dark-text/50 text-sm !mt-0 mb-4">
              These questions help set realistic expectations about the EB-3 pathway.
            </p>

            <div>
              <span className="block text-sm font-medium text-dark-text mb-2" id="acceptsTimeframe-label">
                The EB-3 process typically takes approximately 2–3 years. Do you understand and
                accept this timeframe? <span className="text-red-500">*</span>
              </span>
              <div className="space-y-2" role="radiogroup" aria-labelledby="acceptsTimeframe-label">
                {['yes', 'no'].map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                    <input type="radio" name="acceptsTimeframe" value={opt} checked={acceptsTimeframe === opt}
                      onChange={(e) => setAcceptsTimeframe(e.target.value)} className="w-5 h-5 text-gold accent-gold" />
                    <span className="text-dark-text/80">{opt === 'yes' ? 'Yes' : 'No'}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium text-dark-text mb-2" id="seeksPermanentRelocation-label">
                Are you seeking permanent relocation to the United States (not temporary or
                short-term work)? <span className="text-red-500">*</span>
              </span>
              <div className="space-y-2" role="radiogroup" aria-labelledby="seeksPermanentRelocation-label">
                {['yes', 'no'].map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                    <input type="radio" name="seeksPermanentRelocation" value={opt} checked={seeksPermanentRelocation === opt}
                      onChange={(e) => setSeeksPermanentRelocation(e.target.value)} className="w-5 h-5 text-gold accent-gold" />
                    <span className="text-dark-text/80">{opt === 'yes' ? 'Yes' : 'No'}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium text-dark-text mb-2" id="understandsInfoOnly-label">
                Do you understand that this session is informational only and does not guarantee
                approval or employment? <span className="text-red-500">*</span>
              </span>
              <div className="space-y-2" role="radiogroup" aria-labelledby="understandsInfoOnly-label">
                {['yes', 'no'].map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                    <input type="radio" name="understandsInfoOnly" value={opt} checked={understandsInfoOnly === opt}
                      onChange={(e) => setUnderstandsInfoOnly(e.target.value)} className="w-5 h-5 text-gold accent-gold" />
                    <span className="text-dark-text/80">{opt === 'yes' ? 'Yes' : 'No'}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium text-dark-text mb-2" id="acceptsFinancialCosts-label">
                Financial Expectations <span className="text-red-500">*</span>
              </span>
              <p className="text-dark-text/60 text-sm mb-3">
                Employment-based immigration involves certain costs. Do you understand and accept
                that participation in the EB-3 process typically includes:
              </p>
              <ul className="text-dark-text/60 text-sm mb-4 ml-4 space-y-1">
                <li>• Professional legal fees</li>
                <li>• Required government filing fees</li>
                <li>• Personal relocation and initial settlement (landing) costs</li>
              </ul>
              <div className="space-y-2" role="radiogroup" aria-labelledby="acceptsFinancialCosts-label">
                <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                  <input type="radio" name="acceptsFinancialCosts" value="yes" checked={acceptsFinancialCosts === 'yes'}
                    onChange={(e) => setAcceptsFinancialCosts(e.target.value)} className="w-5 h-5 text-gold accent-gold" />
                  <span className="text-dark-text/80">Yes, I understand and accept this</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                  <input type="radio" name="acceptsFinancialCosts" value="no" checked={acceptsFinancialCosts === 'no'}
                    onChange={(e) => setAcceptsFinancialCosts(e.target.value)} className="w-5 h-5 text-gold accent-gold" />
                  <span className="text-dark-text/80">No, I am not prepared for these costs</span>
                </label>
              </div>
              <p className="text-dark-text/50 text-xs mt-2 italic">
                Specific cost details, if applicable, are discussed only after eligibility review
                and are not part of this information session.
              </p>
            </div>
          </fieldset>

          {/* ── Section 4: Session Selection ── */}
          <fieldset className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sm:p-8 space-y-6" ref={(el) => { sectionRefs.current[3] = el; }}>
            <legend className="text-lg sm:text-xl font-bold text-slate-900 pb-1 w-full">
              Section 4 — Session Selection
            </legend>
            <p className="text-dark-text/50 text-sm !mt-0 mb-4">
              Choose when and how you'd like to join us.
            </p>

            <div>
              <span className="block text-sm font-medium text-dark-text mb-2" id="attendanceMode-label">
                How would you like to attend this information session? <span className="text-red-500">*</span>
              </span>
              <div className="space-y-2" role="radiogroup" aria-labelledby="attendanceMode-label">
                <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                  <input type="radio" name="attendanceMode" value="in-person" checked={attendanceMode === 'in-person'}
                    onChange={(e) => { setAttendanceMode(e.target.value); setSelectedSession(''); }}
                    className="w-5 h-5 text-gold accent-gold" />
                  <span className="text-dark-text/80">In-person (Dubai or Abu Dhabi)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                  <input type="radio" name="attendanceMode" value="online" checked={attendanceMode === 'online'}
                    onChange={(e) => { setAttendanceMode(e.target.value); setSelectedSession(''); }}
                    className="w-5 h-5 text-gold accent-gold" />
                  <span className="text-dark-text/80">Online (Live virtual session)</span>
                </label>
              </div>
              <p className="text-dark-text/50 text-xs mt-2">
                Attendance is limited and subject to confirmation.
              </p>
            </div>

            {attendanceMode === 'in-person' && (
              <div className="space-y-6">
                <p className="text-sm font-medium text-dark-text" id="selectedSession-label">
                  Please select ONE in-person session only. <span className="text-red-500">*</span>
                </p>
                <div role="radiogroup" aria-labelledby="selectedSession-label">
                  <div>
                    <h4 className="text-sm font-semibold text-dark-text/70 mb-3">Dubai (In-Person)</h4>
                    <div className="space-y-2">
                      {dubaiInPerson.map((session) => (
                        <label key={session} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                          <input type="radio" name="selectedSession" value={session} checked={selectedSession === session}
                            onChange={(e) => setSelectedSession(e.target.value)} className="w-5 h-5 text-gold accent-gold" />
                          <span className="text-dark-text/80 text-sm"><span className="block sm:inline">{session.split(' | ')[0]}</span><span className="hidden sm:inline"> | </span><br className="sm:hidden" /><span className="text-dark-text/60">{session.split(' | ')[1]}</span></span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-dark-text/70 mb-3">Abu Dhabi (In-Person)</h4>
                    <div className="space-y-2">
                      {abuDhabiInPerson.map((session) => (
                        <label key={session} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                          <input type="radio" name="selectedSession" value={session} checked={selectedSession === session}
                            onChange={(e) => setSelectedSession(e.target.value)} className="w-5 h-5 text-gold accent-gold" />
                          <span className="text-dark-text/80 text-sm"><span className="block sm:inline">{session.split(' | ')[0]}</span><span className="hidden sm:inline"> | </span><br className="sm:hidden" /><span className="text-dark-text/60">{session.split(' | ')[1]}</span></span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-dark-text/50 text-xs italic">
                  Session selection does not guarantee attendance. Invitations are sent manually.
                </p>
              </div>
            )}

            {attendanceMode === 'online' && (
              <div className="space-y-4">
                <p className="text-sm font-medium text-dark-text" id="selectedSession-online-label">
                  Please select ONE online session only. <span className="text-red-500">*</span>
                </p>
                <div role="radiogroup" aria-labelledby="selectedSession-online-label">
                  <h4 className="text-sm font-semibold text-dark-text/70 mb-2">
                    Online (Live Virtual – UAE Time)
                  </h4>
                  <div className="space-y-2">
                    {onlineSessions.map((session) => (
                      <label key={session} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                        <input type="radio" name="selectedSession" value={session} checked={selectedSession === session}
                          onChange={(e) => setSelectedSession(e.target.value)} className="w-5 h-5 text-gold accent-gold" />
                        <span className="text-dark-text/80 text-sm"><span className="block sm:inline">{session.split(' | ')[0]}</span><span className="hidden sm:inline"> | </span><br className="sm:hidden" /><span className="text-dark-text/60">{session.split(' | ')[1]}</span></span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-dark-text/50 text-xs italic">
                  Access details will be shared with confirmed online attendees only.
                </p>
              </div>
            )}
          </fieldset>

          {/* ── Section 5: Final Acknowledgment ── */}
          <fieldset className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sm:p-8 space-y-4" ref={(el) => { sectionRefs.current[4] = el; }}>
            <legend className="text-lg sm:text-xl font-bold text-slate-900 pb-1 w-full">
              Section 5 — Final Acknowledgment
            </legend>
            <p className="text-dark-text/50 text-sm !mt-0 mb-4">
              Almost done — just one final step.
            </p>

            <label className="flex items-start gap-3 cursor-pointer min-h-[44px]">
              <input
                type="checkbox"
                checked={acknowledgedAccuracy}
                onChange={(e) => setAcknowledgedAccuracy(e.target.checked)}
                aria-required="true"
                className="w-5 h-5 text-gold accent-gold mt-0.5"
              />
              <span className="text-dark-text/80 text-sm">
                I confirm that the information provided is accurate and understand that submission
                of this form does not guarantee an invitation to attend.{' '}
                <span className="text-red-500">*</span>
              </span>
            </label>
          </fieldset>

          {/* ── Error display (single alert) ── */}
          {error && (
            <div
              ref={errorRef}
              tabIndex={-1}
              role="alert"
              aria-live="assertive"
              className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-4 outline-none"
            >
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* ── Privacy assurance ── */}
          <div className="flex items-center justify-center gap-2 text-dark-text/40">
            <Lock className="w-4 h-4 shrink-0" />
            <p className="text-xs">
              Your information is encrypted and kept strictly confidential. It will only be
              shared with the session facilitators to prepare for your attendance.
            </p>
          </div>

          {/* ── Submit ── */}
          <div className="text-center space-y-3">
            <button
              type="submit"
              disabled={submitting || emailExists}
              aria-busy={submitting}
              className="inline-block px-10 py-4 bg-gold text-white font-bold rounded-xl hover:brightness-110 hover:scale-[1.02] active:scale-100 transition-all text-lg disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-gold/25"
            >
              {submitting ? 'Submitting...' : 'Apply to Attend'}
            </button>
            <div>
              <button
                type="button"
                onClick={handleClearForm}
                className="text-dark-text/40 text-xs underline hover:text-dark-text/60 transition-colors"
              >
                Clear form and start over
              </button>
            </div>
          </div>
        </form>
      </div>
    </SectionWrapper>
  );
}
