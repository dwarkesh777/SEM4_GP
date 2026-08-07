import React, { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const languages = [
    { code: "en", label: "English - EN", shortName: "English" },
    { code: "hi", label: "हिन्दी - HI", shortName: "हिन्दी" },
    { code: "gu", label: "ગુજરાતી - GU", shortName: "ગુજરાતી" },
    { code: "ta", label: "தமிழ் - TA", shortName: "தமிழ்" },
    { code: "te", label: "తెలుగు - TE", shortName: "తెలుగు" },
    { code: "kn", label: "ಕನ್ನಡ - KN", shortName: "ಕನ್ನಡ" },
    { code: "ml", label: "മലയാളം - ML", shortName: "മലയാളം" },
    { code: "bn", label: "বাংলা - BN", shortName: "বাংলা" },
    { code: "mr", label: "मराठी - MR", shortName: "मराठी" },
];

const getStoredLang = () => {
    try {
        const saved = localStorage.getItem("selected_language");
        if (saved && languages.some((l) => l.code === saved)) return saved;

        const match = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([a-z]{2})/);
        if (match && match[1] && languages.some((l) => l.code === match[1])) {
            return match[1];
        }
    } catch {
        // Fallback safely
    }
    return "en";
};

const LanguageSelector = ({ variant = "navbar" }) => {
    const [currentLang, setCurrentLang] = useState(getStoredLang());

    // Initialize Google Translate script
    useEffect(() => {
        if (!document.getElementById("google-translate-script")) {
            window.googleTranslateElementInit = () => {
                if (window.google && window.google.translate) {
                    new window.google.translate.TranslateElement(
                        {
                            pageLanguage: "en",
                            includedLanguages: "en,hi,gu,ta,te,kn,ml,bn,mr",
                            autoDisplay: false,
                        },
                        "google_translate_element"
                    );
                }
            };

            const script = document.createElement("script");
            script.id = "google-translate-script";
            script.type = "text/javascript";
            script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const setLanguage = (langCode) => {
        setCurrentLang(langCode);
        localStorage.setItem("selected_language", langCode);

        const cookieValue = `/en/${langCode}`;
        document.cookie = `googtrans=${cookieValue}; path=/;`;
        document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname};`;

        if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
            const domainParts = window.location.hostname.split(".");
            if (domainParts.length > 1) {
                const rootDomain = "." + domainParts.slice(-2).join(".");
                document.cookie = `googtrans=${cookieValue}; path=/; domain=${rootDomain};`;
            }
        }

        // Trigger Google Translate change event
        const select = document.querySelector(".goog-te-combo");
        if (select) {
            select.value = langCode;
            select.dispatchEvent(new Event("change"));
        } else {
            window.location.reload();
        }
    };

    const currentLangObj = languages.find((l) => l.code === currentLang) || languages[0];

    return (
        <div className="relative inline-block notranslate">
            {/* Hidden container for Google Translate element */}
            <div id="google_translate_element" style={{ display: "none" }} />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className={`flex items-center gap-2 rounded-xl transition-all duration-200 focus:outline-none select-none cursor-pointer z-10 ${
                            variant === "navbar"
                                ? "bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 text-xs sm:text-sm font-semibold shadow-md shadow-slate-900/10 border border-slate-700/60 active:scale-95"
                                : "bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 text-sm font-bold border border-slate-200 shadow-sm active:scale-95"
                        }`}
                        aria-label="Change Language"
                    >
                        <Globe className="w-4 h-4 text-slate-300 shrink-0" />
                        <span className="truncate max-w-[85px]">{currentLangObj.shortName}</span>
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-64 p-2.5 rounded-2xl shadow-2xl !bg-white !text-slate-900 border border-slate-200 z-[99999] max-h-[80vh] overflow-y-auto"
                >
                    <DropdownMenuLabel className="px-3 pt-1.5 pb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Change Language
                    </DropdownMenuLabel>

                    <div className="space-y-1 mt-1">
                        {languages.map((lang) => {
                            const isSelected = lang.code === currentLang;
                            return (
                                <DropdownMenuItem
                                    key={lang.code}
                                    onClick={() => setLanguage(lang.code)}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 cursor-pointer ${
                                        isSelected
                                            ? "!bg-blue-600 !text-white font-bold shadow-md shadow-blue-600/30 hover:!bg-blue-600 hover:!text-white"
                                            : "!text-slate-800 hover:!bg-slate-100 font-semibold"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Custom Radio Button */}
                                        <div
                                            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 ${
                                                isSelected
                                                    ? "border-2 border-white bg-blue-600"
                                                    : "border-2 border-slate-400 bg-white"
                                            }`}
                                        >
                                            {isSelected && (
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            )}
                                        </div>
                                        <span className="tracking-wide text-sm">{lang.label}</span>
                                    </div>
                                </DropdownMenuItem>
                            );
                        })}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default LanguageSelector;
