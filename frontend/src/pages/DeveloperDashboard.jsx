import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";
import {
    Code2, KeyRound, Send, LogOut, Copy,
    BookOpen, Zap, Shield, Globe,
    CheckCircle, AlertCircle, Activity, Settings,
    ChevronDown, ChevronUp, ArrowRight, Lock, Unlock,
    X, Smartphone, ShieldCheck, Eye, EyeOff, QrCode,
    RefreshCw, Info, ShieldOff, ToggleLeft, ToggleRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

/* ─────────────────────────────────────────────────────────────────────────────
   Pure-JS TOTP (Web Crypto API — no external deps)
   ──────────────────────────────────────────────────────────────────────────── */
function base32Decode(base32) {
    const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    const clean = base32.toUpperCase().replace(/=+$/, "").replace(/\s/g, "");
    let bits = 0, value = 0;
    const out = [];
    for (const ch of clean) {
        const idx = ALPHA.indexOf(ch);
        if (idx < 0) continue;
        value = (value << 5) | idx;
        bits += 5;
        if (bits >= 8) { out.push((value >>> (bits - 8)) & 255); bits -= 8; }
    }
    return new Uint8Array(out);
}

function generateBase32Secret() {
    const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    const bytes = crypto.getRandomValues(new Uint8Array(20));
    let result = "", bits = 0, value = 0;
    for (const byte of bytes) {
        value = (value << 8) | byte; bits += 8;
        while (bits >= 5) { result += ALPHA[(value >>> (bits - 5)) & 31]; bits -= 5; }
    }
    if (bits > 0) result += ALPHA[(value << (5 - bits)) & 31];
    return result;
}

async function computeTOTP(secret, counter) {
    const keyBytes = base32Decode(secret);
    const msg = new ArrayBuffer(8);
    const msgView = new DataView(msg);
    msgView.setUint32(4, counter >>> 0, false);
    const cryptoKey = await crypto.subtle.importKey(
        "raw", keyBytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]
    );
    const sig = new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, msg));
    const offset = sig[19] & 0xf;
    const code = (
        ((sig[offset] & 0x7f) << 24) | ((sig[offset + 1] & 0xff) << 16) |
        ((sig[offset + 2] & 0xff) << 8) | (sig[offset + 3] & 0xff)
    ) % 1_000_000;
    return code.toString().padStart(6, "0");
}

async function verifyTOTP(secret, userCode) {
    const T = Math.floor(Date.now() / 1000 / 30);
    for (const delta of [0, -1, 1]) {
        if ((await computeTOTP(secret, T + delta)) === userCode) return true;
    }
    return false;
}

function buildOTPAuthURI(email, secret) {
    const label = encodeURIComponent(`NestNode:${email}`);
    return `otpauth://totp/${label}?secret=${secret}&issuer=NestNode&algorithm=SHA1&digits=6&period=30`;
}

function qrImgSrc(uri) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=12&data=${encodeURIComponent(uri)}`;
}

const secretKey   = (email) => `devTOTPSecret_${email}`;
const enabledKey  = (email) => `devTOTPEnabled_${email}`;

/* ─────────────────────────────────────────────────────────────────────────────
   Countdown ring
   ──────────────────────────────────────────────────────────────────────────── */
const TimerRing = () => {
    const [timer, setTimer] = useState(() => 30 - (new Date().getSeconds() % 30));
    useEffect(() => {
        const id = setInterval(() => setTimer(t => (t <= 1 ? 30 : t - 1)), 1000);
        return () => clearInterval(id);
    }, []);
    const pct = (timer / 30) * 100;
    const color = timer > 10 ? "#3b82f6" : timer > 5 ? "#f59e0b" : "#ef4444";
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="relative w-9 h-9 shrink-0">
                <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15" fill="none" stroke={color} strokeWidth="3"
                        strokeDasharray={`${2 * Math.PI * 15}`}
                        strokeDashoffset={`${2 * Math.PI * 15 * (1 - pct / 100)}`}
                        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
                        strokeLinecap="round"
                    />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black" style={{ color }}>{timer}</span>
            </div>
            <div>
                <p className="text-xs font-bold text-slate-700">Code refreshes in {timer}s</p>
                <p className="text-[10px] text-slate-500">Open Google Authenticator → NestNode</p>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────────────────────────
   OTP digit row
   ──────────────────────────────────────────────────────────────────────────── */
const OTPRow = ({ digits, setDigits, shake, inputRefs, onPaste }) => (
    <motion.div
        animate={shake ? { x: [-8, 8, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.45 }}
        className="flex gap-2.5 justify-center"
        onPaste={onPaste}
    >
        {digits.map((d, i) => (
            <div key={i} className="relative">
                {i === 3 && <span className="absolute -left-2 top-1/2 -translate-y-1/2 text-slate-500 text-lg pointer-events-none select-none">–</span>}
                <input
                    ref={el => { if (inputRefs) inputRefs.current[i] = el; }}
                    type="text" inputMode="numeric" maxLength={1} value={d}
                    onChange={e => {
                        const ch = e.target.value.replace(/\D/g, "").slice(-1);
                        const next = [...digits]; next[i] = ch; setDigits(next);
                        if (ch && i < 5 && inputRefs) inputRefs.current[i + 1]?.focus();
                    }}
                    onKeyDown={e => {
                        if (e.key === "Backspace" && !digits[i] && i > 0 && inputRefs) inputRefs.current[i - 1]?.focus();
                        if (e.key === "ArrowLeft" && i > 0 && inputRefs) inputRefs.current[i - 1]?.focus();
                        if (e.key === "ArrowRight" && i < 5 && inputRefs) inputRefs.current[i + 1]?.focus();
                    }}
                    className={`w-11 h-14 text-center text-xl font-black rounded-2xl border-2 outline-none transition-all bg-white text-slate-900 caret-transparent
                        ${d ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-600/10" : "border-slate-200 focus:border-blue-600/50 focus:bg-white"}`}
                />
            </div>
        ))}
    </motion.div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   SETUP MODAL (QR scan + first-code confirm)
   ──────────────────────────────────────────────────────────────────────────── */
const SetupModal = ({ isOpen, onClose, onSetupComplete, email }) => {
    const [secret] = useState(generateBase32Secret);
    const [step, setStep] = useState(1);
    const [digits, setDigits] = useState(Array(6).fill(""));
    const [shake, setShake] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [qrError, setQrError] = useState(false);
    const inputRefs = useRef([]);
    const otpURI = buildOTPAuthURI(email, secret);

    useEffect(() => {
        if (isOpen) { setStep(1); setDigits(Array(6).fill("")); setShake(false); setQrError(false); }
    }, [isOpen]);

    useEffect(() => {
        if (step === 2) setTimeout(() => inputRefs.current[0]?.focus(), 120);
    }, [step]);

    const handlePaste = e => {
        e.preventDefault();
        const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        setDigits(Array(6).fill("").map((_, i) => p[i] || ""));
        inputRefs.current[Math.min(p.length, 5)]?.focus();
    };

    const handleVerify = async () => {
        const code = digits.join("");
        if (code.length < 6) { setShake(true); setTimeout(() => setShake(false), 600); return; }
        setVerifying(true);
        const ok = await verifyTOTP(secret, code);
        if (ok) {
            localStorage.setItem(secretKey(email), secret);
            localStorage.setItem(enabledKey(email), "true");
            toast.success("Google Authenticator enabled! 🔐");
            onSetupComplete();
            onClose();
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 600);
            toast.error("Wrong code — open Authenticator and try the latest code.");
            setDigits(Array(6).fill(""));
            inputRefs.current[0]?.focus();
        }
        setVerifying(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)" }}
            >
                <motion.div
                    initial={{ scale: 0.88, opacity: 0, y: 28 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.88, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 340, damping: 28 }}
                    className="relative w-full max-w-md"
                >
                    <div className="absolute -inset-px rounded-[28px] bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-transparent" />
                    <div className="relative rounded-[28px] bg-white border border-slate-200 shadow-2xl overflow-hidden shadow-2xl">

                        {/* Header */}
                        <div className="bg-gradient-to-br from-slate-50 to-white px-7 pt-7 pb-5 border-b border-slate-100">
                            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all">
                                <X className="w-4 h-4" />
                            </button>
                            {/* Step dots */}
                            <div className="flex items-center gap-2 justify-center mb-5">
                                {[1, 2].map(s => (
                                    <div key={s} className={`h-2 rounded-full transition-all duration-500 ${step >= s ? "w-8 bg-blue-600" : "w-2 bg-slate-200"}`} />
                                ))}
                            </div>
                            <div className="flex justify-center mb-4">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-xl shadow-blue-500/30">
                                        {step === 1 ? <QrCode className="w-8 h-8 text-slate-900" /> : <ShieldCheck className="w-8 h-8 text-slate-900" />}
                                    </div>
                                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-[9px] font-black text-slate-900">{step}/2</span>
                                </div>
                            </div>
                            <h2 className="text-center text-xl font-black text-slate-900 mb-1">
                                {step === 1 ? "Scan QR with Authenticator" : "Confirm — Enter First Code"}
                            </h2>
                            <p className="text-center text-sm text-slate-600 leading-relaxed">
                                {step === 1
                                    ? "Open Google Authenticator → tap + → Scan QR code"
                                    : "Enter the 6-digit code now shown in your Authenticator app"}
                            </p>
                        </div>

                        {/* Step 1: QR */}
                        {step === 1 && (
                            <div className="px-7 py-6 space-y-5">
                                {/* QR card */}
                                <div className="flex flex-col items-center gap-3">
                                    <div className="p-3 rounded-2xl bg-white shadow-xl border-4 border-blue-500/20">
                                        {!qrError ? (
                                            <img src={qrImgSrc(otpURI)} alt="QR Code" width={180} height={180}
                                                className="rounded-lg block" onError={() => setQrError(true)} />
                                        ) : (
                                            <div className="w-[180px] h-[180px] flex flex-col items-center justify-center gap-2 text-slate-600">
                                                <AlertCircle className="w-8 h-8 text-amber-600" />
                                                <p className="text-xs text-center">QR failed to load.<br/>Use the code below.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Steps */}
                                <div className="space-y-2">
                                    {["Install Google Authenticator (iOS / Android)", "Tap  +  →  Scan a QR code", "Point camera at the QR code above"].map((s, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-black flex items-center justify-center shrink-0">{i + 1}</div>
                                            <p className="text-slate-600 text-sm">{s}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Manual secret */}
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                        <Info className="w-3 h-3" /> Manual entry key
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <code className="text-blue-600 font-mono text-sm tracking-widest flex-1 break-all">
                                            {secret.match(/.{1,4}/g)?.join(" ")}
                                        </code>
                                        <button onClick={() => { navigator.clipboard.writeText(secret); toast.success("Secret copied!"); }}
                                            className="shrink-0 p-1.5 rounded-lg border border-slate-700 text-slate-600 hover:text-blue-600 transition-colors">
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <Button onClick={() => setStep(2)}
                                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-slate-900 font-black shadow-lg shadow-blue-600/20">
                                    I've Scanned It — Next <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        )}

                        {/* Step 2: verify first code */}
                        {step === 2 && (
                            <div className="px-7 py-6 space-y-5">
                                <TimerRing />
                                <OTPRow digits={digits} setDigits={setDigits} shake={shake} inputRefs={inputRefs} onPaste={handlePaste} />
                                <p className="text-center text-[10px] text-slate-500">Enter the code shown in Google Authenticator right now</p>
                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={() => { setStep(1); setDigits(Array(6).fill("")); }}
                                        className="flex-1 h-12 rounded-2xl border-slate-700 text-slate-700 hover:bg-slate-100 font-bold">← Back</Button>
                                    <Button onClick={handleVerify} disabled={verifying || digits.join("").length < 6}
                                        className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-slate-900 font-black shadow-lg shadow-blue-600/20 disabled:opacity-40">
                                        {verifying
                                            ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying...</span>
                                            : <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" />Activate 2FA</span>}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

/* ─────────────────────────────────────────────────────────────────────────────
   VERIFY MODAL (already configured — just ask code)
   ──────────────────────────────────────────────────────────────────────────── */
const VerifyModal = ({ isOpen, onClose, onVerify, keyLabel, email }) => {
    const [digits, setDigits] = useState(Array(6).fill(""));
    const [shake, setShake] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => { if (isOpen) { setDigits(Array(6).fill("")); setShake(false); } }, [isOpen]);
    useEffect(() => { if (isOpen) setTimeout(() => inputRefs.current[0]?.focus(), 120); }, [isOpen]);

    const handlePaste = e => {
        e.preventDefault();
        const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        setDigits(Array(6).fill("").map((_, i) => p[i] || ""));
        inputRefs.current[Math.min(p.length, 5)]?.focus();
    };

    const handleVerify = async () => {
        const code = digits.join("");
        if (code.length < 6) { setShake(true); setTimeout(() => setShake(false), 600); return; }
        setVerifying(true);
        const secret = localStorage.getItem(secretKey(email)) || "";
        const ok = await verifyTOTP(secret, code);
        if (ok) {
            toast.success("Verified! ✓", { icon: "🔐" });
            onVerify(); onClose();
        } else {
            setShake(true); setTimeout(() => setShake(false), 600);
            toast.error("Incorrect code. Try the latest code from Authenticator.");
            setDigits(Array(6).fill("")); inputRefs.current[0]?.focus();
        }
        setVerifying(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)" }}
            >
                <motion.div
                    initial={{ scale: 0.88, opacity: 0, y: 28 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.88, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 340, damping: 28 }}
                    className="relative w-full max-w-sm"
                >
                    <div className="absolute -inset-px rounded-[28px] bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-transparent" />
                    <div className="relative rounded-[28px] bg-white border border-slate-200 shadow-2xl overflow-hidden shadow-2xl">
                        <div className="bg-gradient-to-br from-slate-50 to-white px-7 pt-7 pb-6 border-b border-slate-100">
                            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all">
                                <X className="w-4 h-4" />
                            </button>
                            <div className="flex justify-center mb-4">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-xl shadow-blue-500/30">
                                        <Smartphone className="w-8 h-8 text-slate-900" />
                                    </div>
                                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                                        <ShieldCheck className="w-3 h-3 text-slate-900" />
                                    </span>
                                </div>
                            </div>
                            <h2 className="text-center text-xl font-black text-slate-900 mb-1">2FA Verification</h2>
                            <p className="text-center text-sm text-slate-600">
                                Enter your <span className="text-blue-600 font-bold">Authenticator code</span> to reveal <span className="text-slate-900 font-bold">{keyLabel}</span>
                            </p>
                        </div>
                        <div className="px-7 py-6 space-y-5">
                            <TimerRing />
                            <OTPRow digits={digits} setDigits={setDigits} shake={shake} inputRefs={inputRefs} onPaste={handlePaste} />
                            <Button onClick={handleVerify} disabled={verifying || digits.join("").length < 6}
                                className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-slate-900 font-black shadow-lg shadow-blue-600/20 disabled:opacity-40">
                                {verifying
                                    ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying...</span>
                                    : <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" />Verify & Reveal Key</span>}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

/* ─── CopyBtn ──────────────────────────────────────────────────────────────── */
const CopyBtn = ({ text }) => {
    const [copied, setCopied] = useState(false);
    return (
        <button onClick={async () => { try { await navigator.clipboard.writeText(text); setCopied(true); toast.success("Copied!"); setTimeout(() => setCopied(false), 2000); } catch { toast.error("Copy failed"); } }}
            className="shrink-0 p-2 rounded-xl border border-slate-700 text-slate-600 hover:text-blue-600 hover:border-blue-500/50 hover:bg-blue-50 transition-all">
            {copied ? <CheckCircle className="w-4 h-4 text-blue-600" /> : <Copy className="w-4 h-4" />}
        </button>
    );
};

/* ─── EndpointRow ──────────────────────────────────────────────────────────── */
const EndpointRow = ({ method, path, description }) => {
    const colors = { GET: "bg-blue-100 text-blue-600 border-emerald-500/30", POST: "bg-indigo-50 text-indigo-600 border-indigo-200" };
    return (
        <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
            <span className={`shrink-0 text-[10px] font-black px-2 py-0.5 rounded-lg border font-mono mt-0.5 ${colors[method]}`}>{method}</span>
            <div className="min-w-0">
                <code className="text-slate-700 text-sm font-mono break-all">{path}</code>
                <p className="text-slate-500 text-xs mt-0.5">{description}</p>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────────────────────────
   2FA Toggle Card (used in Settings tab)
   ──────────────────────────────────────────────────────────────────────────── */
const TwoFACard = ({ email, onStatusChange }) => {
    const [enabled, setEnabled] = useState(() => localStorage.getItem(enabledKey(email)) === "true");
    const [setupOpen, setSetupOpen] = useState(false);
    const [disabling, setDisabling] = useState(false);

    const handleSetupComplete = () => {
        setEnabled(true);
        onStatusChange(true);
    };

    const handleDisable = () => {
        setDisabling(true);
        setTimeout(() => {
            localStorage.removeItem(enabledKey(email));
            localStorage.removeItem(secretKey(email));
            setEnabled(false);
            onStatusChange(false);
            setDisabling(false);
            toast.success("2FA disabled. API keys are no longer protected.");
        }, 600);
    };

    return (
        <>
            <SetupModal isOpen={setupOpen} onClose={() => setSetupOpen(false)} onSetupComplete={handleSetupComplete} email={email} />

            <div className={`rounded-2xl border p-6 transition-all duration-500 ${enabled ? "border-blue-500/30 bg-gradient-to-br from-blue-50 to-white" : "border-slate-200 bg-white"}`}>
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${enabled ? "bg-blue-100" : "bg-slate-100"}`}>
                            {enabled
                                ? <ShieldCheck className="w-6 h-6 text-blue-600" />
                                : <ShieldOff className="w-6 h-6 text-slate-500" />}
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                                Two-Factor Authentication
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${enabled ? "bg-blue-100 text-blue-600 border-emerald-500/30" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                                    {enabled ? "● ACTIVE" : "○ INACTIVE"}
                                </span>
                            </h3>
                            <p className="text-slate-500 text-xs mt-0.5">
                                {enabled ? "API keys are protected by Google Authenticator TOTP codes." : "Enable to protect API key access with Google Authenticator."}
                            </p>
                        </div>
                    </div>

                    {/* Big toggle */}
                    <button
                        onClick={enabled ? handleDisable : () => setSetupOpen(true)}
                        className={`shrink-0 flex items-center w-12 h-6 rounded-full p-0.5 transition-all duration-300 focus:outline-none ${enabled ? "bg-blue-600" : "bg-slate-200 border border-slate-300"}`}
                        title={enabled ? "Disable 2FA" : "Enable 2FA"}
                    >
                        <motion.div
                            animate={{ x: enabled ? 24 : 2 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="w-4 h-4 rounded-full bg-white shadow-md shrink-0"
                        />
                    </button>
                </div>

                {/* Status detail */}
                {enabled ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-600/8 border border-blue-500/20">
                            <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                            <p className="text-sm text-blue-900">
                                <span className="font-bold">Google Authenticator is active.</span> Each time you reveal an API key, you'll need to enter your 6-digit code.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSetupOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-300 transition-colors">
                                <RefreshCw className="w-3.5 h-3.5" /> Reconfigure authenticator
                            </button>
                            <span className="text-slate-700">·</span>
                            <button onClick={handleDisable} className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition-colors">
                                <ShieldOff className="w-3.5 h-3.5" /> Disable 2FA
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Feature list */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {[
                                "API keys hidden until TOTP verified",
                                "30-second rotating codes",
                                "Works offline on your phone",
                                "Industry-standard RFC 6238",
                            ].map(f => (
                                <div key={f} className="flex items-center gap-2 text-xs text-slate-500">
                                    <CheckCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    {f}
                                </div>
                            ))}
                        </div>

                        {/* Enable button */}
                        <Button
                            onClick={() => setSetupOpen(true)}
                            className="h-11 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-slate-900 font-black shadow-lg shadow-blue-600/20 gap-2"
                        >
                            <QrCode className="w-4 h-4" />
                            Enable Google Authenticator
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Main Developer Dashboard
   ──────────────────────────────────────────────────────────────────────────── */
const DeveloperDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [info, setInfo] = useState(null);
    const [loadingInfo, setLoadingInfo] = useState(true);
    const [expandedSnippet, setExpandedSnippet] = useState(null);

    const [showReadKey, setShowReadKey] = useState(false);
    const [showBookingKey, setShowBookingKey] = useState(false);
    const [verifyModal, setVerifyModal] = useState({ open: false, target: null });
    const [twoFAEnabled, setTwoFAEnabled] = useState(() =>
        !!(user?.email && localStorage.getItem(enabledKey(user.email)) === "true")
    );

    const [profileData, setProfileData] = useState({ full_name: "", phone_number: "" });
    const [savingProfile, setSavingProfile] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("userRole") !== "developer") navigate("/developer/login", { replace: true });
    }, [navigate]);

    useEffect(() => {
        if (user) {
            setProfileData({ full_name: user.full_name || "", phone_number: user.phone_number || "" });
            setTwoFAEnabled(localStorage.getItem(enabledKey(user.email)) === "true");
        }
    }, [user]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${API_URL}/api/developer/info/`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
            .then(async r => { const d = await r.json().catch(() => ({})); setInfo(r.ok ? d : { read_only_api_key: "Not available", booking_api_key: "Not available" }); })
            .catch(() => setInfo({ read_only_api_key: "Not available", booking_api_key: "Not available" }))
            .finally(() => setLoadingInfo(false));
    }, []);

    const handleLogout = () => { logout(); navigate("/developer/login"); };

    const handleProfileSave = async e => {
        e.preventDefault(); setSavingProfile(true);
        try {
            const token = localStorage.getItem("token");
            const r = await fetch(`${API_URL}/api/auth/profile/`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(profileData) });
            r.ok ? toast.success("Profile updated!") : toast.error("Failed to update profile.");
        } catch { toast.error("Network error."); }
        finally { setSavingProfile(false); }
    };

    const handleRevealKey = target => {
        const already = target === "read" ? showReadKey : showBookingKey;
        if (already) { target === "read" ? setShowReadKey(false) : setShowBookingKey(false); return; }
        if (!twoFAEnabled) {
            toast.error("Enable 2FA in Settings first to reveal your API keys.", { duration: 4000 });
            setActiveTab("settings");
            return;
        }
        setVerifyModal({ open: true, target });
    };

    const handleVerified = () => {
        if (verifyModal.target === "read") setShowReadKey(true);
        else setShowBookingKey(true);
    };

    const navItems = [
        { id: "overview", label: "Overview", icon: Activity },
        { id: "api-keys", label: "API Keys", icon: KeyRound },
        { id: "endpoints", label: "Endpoints", icon: Send },
        { id: "quickstart", label: "Quick Start", icon: BookOpen },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    const codeSnippets = [
        { id: "curl", label: "cURL", code: `curl -X GET \\\n  "${API_URL}/api/public/properties/list/" \\\n  -H "X-API-Key: YOUR_READ_KEY"` },
        { id: "python", label: "Python", code: `import requests\n\nresponse = requests.get(\n    "${API_URL}/api/public/properties/list/",\n    headers={"X-API-Key": "YOUR_READ_KEY"}\n)\nprint(response.json())` },
        { id: "js", label: "JavaScript", code: `const res = await fetch("${API_URL}/api/public/properties/list/", {\n  headers: { "X-API-Key": "YOUR_READ_KEY" }\n});\nconst data = await res.json();` },
    ];

    return (
        <>
            <VerifyModal
                isOpen={verifyModal.open}
                onClose={() => setVerifyModal(v => ({ ...v, open: false }))}
                onVerify={handleVerified}
                keyLabel={verifyModal.target === "read" ? "Read-Only API Key" : "Booking API Key"}
                email={user?.email || ""}
            />

            <div className="min-h-screen bg-slate-50 text-slate-900 flex">
                {/* Sidebar */}
                <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-200 bg-white/60 backdrop-blur-xl p-6 gap-2 sticky top-0 h-screen overflow-y-auto">
                    <Link to="/" className="flex items-center gap-2.5 mb-8">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <Code2 className="w-4 h-4 text-slate-900" />
                        </div>
                        <span className="font-heading text-lg">
                            <span className="font-medium text-slate-900">Nest</span>
                            <span className="font-black text-blue-600">Node</span>
                        </span>
                    </Link>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 px-2">Developer Portal</p>
                    <nav className="flex flex-col gap-1">
                        {navItems.map(({ id, label, icon: Icon }) => (
                            <button key={id} onClick={() => setActiveTab(id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === id ? "bg-blue-100 text-blue-600 border border-blue-500/20" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
                                <Icon className="w-4 h-4 shrink-0" />
                                {label}
                                {id === "settings" && !twoFAEnabled && (
                                    <span className="ml-auto w-2 h-2 rounded-full bg-amber-400" title="2FA not set up" />
                                )}
                            </button>
                        ))}
                    </nav>
                    <div className="mt-auto pt-6 border-t border-slate-800">
                        <div className="flex items-center gap-3 px-2 py-2 mb-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-900 text-sm font-black shrink-0">
                                {user?.full_name?.[0]?.toUpperCase() || "D"}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">{user?.full_name}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-orange-400 hover:bg-orange-500/10 transition-all">
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main */}
                <main className="flex-1 min-w-0">
                    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-black text-slate-900">{navItems.find(n => n.id === activeTab)?.label}</h1>
                            <p className="text-xs text-slate-500">NestNode Developer Dashboard</p>
                        </div>
                        <div className="flex lg:hidden">
                            <select value={activeTab} onChange={e => setActiveTab(e.target.value)} className="bg-slate-100 text-slate-700 text-sm rounded-xl px-3 py-2 border border-slate-700 outline-none">
                                {navItems.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
                            </select>
                        </div>
                        <div className="hidden lg:flex items-center gap-3">
                            {twoFAEnabled
                                ? <Badge className="bg-blue-100 text-blue-600 border border-emerald-500/25 text-xs gap-1.5"><ShieldCheck className="w-3 h-3" />2FA Active</Badge>
                                : <Badge className="bg-amber-50 text-amber-600 border border-amber-200 text-xs gap-1.5"><ShieldOff className="w-3 h-3" />2FA Off</Badge>
                            }
                            <Badge className="bg-slate-100 text-slate-600 border border-slate-700 text-xs">Developer</Badge>
                        </div>
                    </header>

                    <div className="p-6 max-w-5xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}>

                            {/* OVERVIEW */}
                            {activeTab === "overview" && (
                                <div className="space-y-6">
                                    <div className="relative rounded-3xl bg-gradient-to-br from-white to-blue-50/50 border border-slate-200 p-8 overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full" />
                                        <div className="relative z-10">
                                            <p className="text-blue-600 text-sm font-bold uppercase tracking-widest mb-2">Welcome back</p>
                                            <h2 className="text-3xl font-black text-slate-900 mb-2">{user?.full_name} 👋</h2>
                                            <p className="text-slate-600 max-w-lg">Your NestNode developer portal. Access API keys, explore endpoints, and integrate hostel data into your applications.</p>
                                            <div className="flex flex-wrap gap-3 mt-6">
                                                <Button onClick={() => setActiveTab("api-keys")} className="bg-blue-600 hover:bg-blue-700 text-slate-900 rounded-xl font-bold gap-2 shadow-lg shadow-blue-600/20">
                                                    <KeyRound className="w-4 h-4" /> View API Keys
                                                </Button>
                                                <button
                                                    onClick={() => setActiveTab("settings")}
                                                    className="border border-slate-850 bg-white hover:bg-slate-100 text-slate-700 rounded-xl font-bold gap-2 px-4 py-2 text-sm flex items-center transition-all shadow-sm"
                                                >
                                                    <ShieldCheck className="w-4 h-4 text-blue-600" /> Security Settings
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {[
                                            { icon: Globe, label: "Base URL", value: API_URL, color: "emerald" },
                                            { icon: Shield, label: "Auth Method", value: "X-API-Key header", color: "cyan" },
                                            { icon: twoFAEnabled ? ShieldCheck : ShieldOff, label: "2FA Status", value: twoFAEnabled ? "Active ✓" : "Not configured", color: twoFAEnabled ? "emerald" : "amber" },
                                        ].map(({ icon: Icon, label, value, color }) => (
                                            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
                                                <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center bg-${color}-500/10`}>
                                                    <Icon className={`w-5 h-5 text-${color}-400`} />
                                                </div>
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{label}</p>
                                                <p className="text-sm font-bold text-slate-900">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-black text-slate-900">Available Endpoints</h3>
                                            <button onClick={() => setActiveTab("endpoints")} className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></button>
                                        </div>
                                        <EndpointRow method="GET" path="/api/public/properties/list/" description="List all verified hostel & PG properties" />
                                        <EndpointRow method="GET" path="/api/public/properties/detail/<id>/" description="Get full detail for one property" />
                                        <EndpointRow method="POST" path="/api/public/bookings/create/" description="Push a booking into the NestNode database" />
                                        <EndpointRow method="GET" path="/api/public/bookings/detail/<id>/" description="Get booking record by ID" />
                                    </div>
                                </div>
                            )}

                            {/* API KEYS */}
                            {activeTab === "api-keys" && (
                                <div className="space-y-5">
                                    {/* 2FA gate banner */}
                                    {twoFAEnabled ? (
                                        <div className="flex items-center gap-3 rounded-2xl border border-blue-500/20 bg-blue-600/5 p-4">
                                            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold text-blue-900">Google Authenticator is protecting your keys</p>
                                                <p className="text-xs text-blue-600/80">Click the eye icon and enter your 6-digit code to reveal any key.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-500/5 p-4">
                                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-amber-300 mb-0.5">2FA is not enabled</p>
                                                <p className="text-xs text-amber-600/80 mb-3">You must enable Google Authenticator in Settings before you can view your API keys.</p>
                                                <button onClick={() => setActiveTab("settings")}
                                                    className="flex items-center gap-1.5 text-xs font-black text-amber-300 hover:text-amber-200 transition-colors">
                                                    <QrCode className="w-3.5 h-3.5" /> Set up 2FA in Settings <ArrowRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {loadingInfo ? (
                                        <div className="flex items-center justify-center h-48">
                                            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-emerald-500 rounded-full animate-spin" />
                                        </div>
                                    ) : (
                                        <>
                                            {/* Read-only key */}
                                            <div className={`rounded-2xl border bg-white p-6 space-y-4 transition-all ${twoFAEnabled ? "border-slate-800" : "border-slate-200/60 opacity-70"}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center"><Unlock className="w-5 h-5 text-blue-600" /></div>
                                                    <div>
                                                        <h3 className="font-black text-slate-900">Read-Only API Key</h3>
                                                        <p className="text-xs text-slate-500">Use for fetching properties and listings</p>
                                                    </div>
                                                    <Badge className="ml-auto bg-blue-600/10 text-blue-600 border-blue-500/20">Read</Badge>
                                                </div>
                                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                                                    <code className="flex-1 text-sm font-mono text-slate-700 break-all">
                                                        {showReadKey ? (info?.read_only_api_key || "Not available") : "••••••••••••••••••••••••••••••••"}
                                                    </code>
                                                    <button onClick={() => handleRevealKey("read")}
                                                        className={`shrink-0 p-2 rounded-xl border transition-all ${!twoFAEnabled ? "border-slate-800 text-slate-700 cursor-not-allowed" : showReadKey ? "border-emerald-500/40 text-blue-600 bg-blue-600/10" : "border-slate-700 text-slate-600 hover:text-blue-600 hover:border-emerald-500/40 hover:bg-blue-600/10"}`}
                                                        disabled={!twoFAEnabled}
                                                        title={!twoFAEnabled ? "Enable 2FA first" : showReadKey ? "Hide" : "Reveal (requires Authenticator code)"}
                                                    >
                                                        {showReadKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                    {showReadKey && <CopyBtn text={info?.read_only_api_key || ""} />}
                                                </div>
                                                {!showReadKey && twoFAEnabled && (
                                                    <button onClick={() => handleRevealKey("read")} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-slate-700 text-slate-600 hover:text-blue-600 hover:border-emerald-500/40 hover:bg-blue-600/5 transition-all text-sm font-bold">
                                                        <Smartphone className="w-4 h-4" /> Verify with Google Authenticator to reveal
                                                    </button>
                                                )}
                                                <div className="text-xs text-slate-500 bg-slate-100/60 rounded-xl p-3 space-y-1">
                                                    <p className="font-bold text-slate-600 mb-1">Allowed endpoints:</p>
                                                    <p>• GET /api/public/properties/list/</p>
                                                    <p>• GET /api/public/properties/detail/{"<id>"}/</p>
                                                    <p>• GET /api/public/bookings/detail/{"<id>"}/</p>
                                                </div>
                                            </div>

                                            {/* Booking key */}
                                            <div className={`rounded-2xl border bg-white p-6 space-y-4 transition-all ${twoFAEnabled ? "border-slate-800" : "border-slate-200/60 opacity-70"}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center"><Lock className="w-5 h-5 text-cyan-600" /></div>
                                                    <div>
                                                        <h3 className="font-black text-slate-900">Booking API Key</h3>
                                                        <p className="text-xs text-slate-500">Use for creating and managing bookings</p>
                                                    </div>
                                                    <Badge className="ml-auto bg-cyan-50 text-cyan-600 border-cyan-500/20">Write</Badge>
                                                </div>
                                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                                                    <code className="flex-1 text-sm font-mono text-slate-700 break-all">
                                                        {showBookingKey ? (info?.booking_api_key || "Not available") : "••••••••••••••••••••••••••••••••"}
                                                    </code>
                                                    <button onClick={() => handleRevealKey("booking")}
                                                        className={`shrink-0 p-2 rounded-xl border transition-all ${!twoFAEnabled ? "border-slate-800 text-slate-700 cursor-not-allowed" : showBookingKey ? "border-cyan-500/40 text-cyan-600 bg-cyan-50" : "border-slate-700 text-slate-600 hover:text-cyan-600 hover:border-cyan-500/40 hover:bg-cyan-50"}`}
                                                        disabled={!twoFAEnabled}
                                                    >
                                                        {showBookingKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                    {showBookingKey && <CopyBtn text={info?.booking_api_key || ""} />}
                                                </div>
                                                {!showBookingKey && twoFAEnabled && (
                                                    <button onClick={() => handleRevealKey("booking")} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-slate-700 text-slate-600 hover:text-cyan-600 hover:border-cyan-500/40 hover:bg-cyan-50 transition-all text-sm font-bold">
                                                        <Smartphone className="w-4 h-4" /> Verify with Google Authenticator to reveal
                                                    </button>
                                                )}
                                                <div className="text-xs text-slate-500 bg-slate-100/60 rounded-xl p-3 space-y-1">
                                                    <p className="font-bold text-slate-600 mb-1">Allowed endpoints:</p>
                                                    <p>• POST /api/public/bookings/create/</p>
                                                    <p>• GET /api/public/bookings/detail/{"<id>"}/</p>
                                                </div>
                                            </div>

                                            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3">
                                                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                                <p className="text-xs text-amber-600/80">Use header <code className="bg-amber-50 px-1 rounded">X-API-Key: your-key</code> or query param <code className="bg-amber-50 px-1 rounded">?appid=your-key</code>. Never commit to version control.</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* ENDPOINTS */}
                            {activeTab === "endpoints" && (
                                <div className="space-y-5">
                                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                        <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-blue-600" />Property Endpoints<Badge className="bg-blue-600/10 text-blue-600 border-blue-500/20 text-xs ml-auto">Read Key</Badge></h3>
                                        <EndpointRow method="GET" path="/api/public/properties/list/" description="Paginated list of all verified properties. Supports ?search, ?city, ?type, ?gender, ?min_price, ?max_price, ?limit" />
                                        <EndpointRow method="GET" path="/api/public/properties/detail/<id>/" description="Full detail for a single property including rooms, images, and amenities." />
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                        <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2"><Send className="w-4 h-4 text-cyan-600" />Booking Endpoints<Badge className="bg-cyan-50 text-cyan-600 border-cyan-500/20 text-xs ml-auto">Booking Key</Badge></h3>
                                        <EndpointRow method="POST" path="/api/public/bookings/create/" description="Push an external booking into NestNode. Requires property_id and room_id." />
                                        <EndpointRow method="GET" path="/api/public/bookings/detail/<id>/" description="Retrieve a booking record by its UUID." />
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                        <h3 className="font-black text-slate-900 mb-4">POST /bookings/create/ — Request Body</h3>
                                        <pre className="text-sm text-slate-700 font-mono whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-xl p-4">{`{\n  "property_id": "<uuid>",\n  "room_id": "<uuid>",\n  "customer_name": "Asha Patel",\n  "customer_phone": "9876543210",\n  "customer_email": "asha@example.com",\n  "amount": 4500,\n  "status": "Confirmed"\n}`}</pre>
                                    </div>
                                </div>
                            )}

                            {/* QUICK START */}
                            {activeTab === "quickstart" && (
                                <div className="space-y-5">
                                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                        <h3 className="font-black text-slate-900 mb-1">Quick Start Guide</h3>
                                        <p className="text-slate-600 text-sm mb-6">Get up and running in under 5 minutes.</p>
                                        <div className="space-y-6">
                                            {[
                                                { step:"1", title:"Enable 2FA in Settings", desc:"Go to Settings and turn on Google Authenticator to protect your API keys.", action:()=>setActiveTab("settings"), actionLabel:"Go to Settings" },
                                                { step:"2", title:"Scan QR & activate", desc:"Scan the QR code with Google Authenticator and enter the first code to activate." },
                                                { step:"3", title:"Reveal your API key", desc:"In the API Keys tab, click the eye icon and enter your 6-digit code to reveal." },
                                                { step:"4", title:"Make your first request", desc:"Add X-API-Key to your request header or use ?appid= as a query param.", action:()=>setActiveTab("endpoints"), actionLabel:"View Endpoints" },
                                            ].map(({ step, title, desc, action, actionLabel }) => (
                                                <div key={step} className="flex gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-slate-900 text-sm font-black flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/25">{step}</div>
                                                    <div>
                                                        <p className="font-black text-slate-900 mb-1">{title}</p>
                                                        <p className="text-slate-600 text-sm">{desc}</p>
                                                        {action && <button onClick={action} className="mt-2 text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">{actionLabel}<ArrowRight className="w-3 h-3" /></button>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                        <h3 className="font-black text-slate-900 mb-4">Code Examples</h3>
                                        <div className="flex gap-2 mb-4 flex-wrap">
                                            {codeSnippets.map(s => (
                                                <button key={s.id} onClick={() => setExpandedSnippet(expandedSnippet === s.id ? null : s.id)}
                                                    className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${expandedSnippet === s.id ? "bg-blue-600 text-slate-900" : "bg-slate-100 text-slate-600 hover:text-slate-900"}`}>
                                                    {s.label}{expandedSnippet === s.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                </button>
                                            ))}
                                        </div>
                                        <AnimatePresence>
                                            {expandedSnippet && (() => { const s = codeSnippets.find(x => x.id === expandedSnippet); return s ? (
                                                <motion.div key={s.id} initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }} className="overflow-hidden">
                                                    <div className="relative rounded-xl bg-slate-50 border border-slate-200 p-4">
                                                        <div className="absolute top-3 right-3"><CopyBtn text={s.code} /></div>
                                                        <pre className="text-sm text-slate-700 font-mono whitespace-pre-wrap pr-10">{s.code}</pre>
                                                    </div>
                                                </motion.div>
                                            ) : null; })()}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}

                            {/* SETTINGS */}
                            {activeTab === "settings" && (
                                <div className="space-y-5">
                                    {/* Profile */}
                                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                        <h3 className="font-black text-slate-900 mb-5">Developer Profile</h3>
                                        <form onSubmit={handleProfileSave} className="space-y-4 max-w-md">
                                            <div className="space-y-1.5">
                                                <Label className="text-slate-700 font-bold text-sm">Full Name</Label>
                                                <input value={profileData.full_name} onChange={e => setProfileData(p => ({ ...p, full_name: e.target.value }))} className="w-full bg-slate-100 border border-slate-700 text-slate-900 rounded-xl h-12 px-4 outline-none focus:ring-2 focus:ring-blue-600/20" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-slate-700 font-bold text-sm">Email Address</Label>
                                                <input value={user?.email || ""} disabled className="w-full bg-slate-100/50 border border-slate-700 text-slate-500 rounded-xl h-12 px-4 cursor-not-allowed" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-slate-700 font-bold text-sm">Phone Number</Label>
                                                <input value={profileData.phone_number} onChange={e => setProfileData(p => ({ ...p, phone_number: e.target.value }))} placeholder="+91 9876543210" className="w-full bg-slate-100 border border-slate-700 text-slate-900 placeholder:text-slate-500 rounded-xl h-12 px-4 outline-none focus:ring-2 focus:ring-blue-600/20" />
                                            </div>
                                            <Button type="submit" disabled={savingProfile} className="bg-blue-600 hover:bg-blue-700 text-slate-900 font-bold rounded-xl h-12 px-8 shadow-lg shadow-blue-600/20">
                                                {savingProfile ? "Saving..." : "Save Profile"}
                                            </Button>
                                        </form>
                                    </div>

                                    {/* ── 2FA CARD ── */}
                                    <TwoFACard
                                        email={user?.email || ""}
                                        onStatusChange={status => {
                                            setTwoFAEnabled(status);
                                            if (!status) { setShowReadKey(false); setShowBookingKey(false); }
                                        }}
                                    />

                                    {/* Danger */}
                                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                                        <h3 className="font-black text-red-400 mb-2">Danger Zone</h3>
                                        <p className="text-slate-600 text-sm mb-4">Sign out from the developer portal on this device.</p>
                                        <Button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-bold gap-2" variant="outline">
                                            <LogOut className="w-4 h-4" /> Sign Out of Developer Portal
                                        </Button>
                                    </div>
                                </div>
                            )}

                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </>
    );
};

export default DeveloperDashboard;
