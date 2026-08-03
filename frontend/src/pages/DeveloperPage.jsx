import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { API_URL } from "@/lib/api";
import { Code2, Copy, KeyRound, TerminalSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const DeveloperPage = () => {
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Auth guard: redirect to developer login if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/developer/login", { replace: true });
        } else if (!authLoading && user && localStorage.getItem("userRole") !== "developer") {
            // If a non-developer logged-in user somehow lands here, send to developer login
            navigate("/developer/login", { replace: true });
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${API_URL}/api/developer/info/`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                    throw new Error(data.detail || "Unable to load developer API information.");
                }
                setInfo(data);
            })
            .catch((error) => {
                console.error(error);
                toast.error(error.message || "Unable to load developer API information.");
                setInfo({
                    api_key: "Not available",
                    header_name: "X-API-Key",
                    example_curl: "curl https://your-domain/api/public/properties/ -H 'X-API-Key: your-api-key'",
                });
            })
            .finally(() => setLoading(false));
    }, []);

    const copyText = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard");
        } catch {
            toast.error("Copy failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Navbar />
            <div className="mx-auto max-w-6xl px-4 py-28 sm:px-6 lg:px-8">
                <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-primary/10 p-3">
                            <Code2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Developer Portal</p>
                            <h1 className="text-3xl font-black">Connect your website to NestNode hostel data</h1>
                        </div>
                    </div>
                    <p className="mt-4 max-w-3xl text-base text-slate-600">
                        Use the API key below to fetch hostel and PG listings from this platform and send booking updates back to your database.
                    </p>
                </div>

                {loading ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600">Loading API details...</div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <KeyRound className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-black">Your API key</h2>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Header</p>
                                <p className="font-mono text-sm font-semibold text-slate-900">{info?.header_name || "X-API-Key"}</p>
                                <p className="mt-2 text-sm text-slate-500">You can also use the query parameter <span className="font-mono text-slate-900">appid</span> like OpenWeather.</p>
                                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                                    <span className="font-mono break-all text-sm text-slate-700">{info?.api_key || "Not available"}</span>
                                    <button onClick={() => copyText(info?.api_key || "")} className="rounded-full border border-slate-200 p-2 hover:bg-slate-50">
                                        <Copy className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="mb-3 flex items-center gap-2">
                                    <TerminalSquare className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-black">Example request</h3>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-sm text-slate-100">
                                    <pre className="overflow-x-auto whitespace-pre-wrap">{info?.example_curl || "curl https://your-domain/api/public/properties/"}</pre>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-center gap-2">
                                    <Send className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-black">Available endpoints</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <p className="font-black text-slate-900">Hostel / PG API</p>
                                        <ul className="mt-2 space-y-2 text-sm text-slate-600">
                                            <li><span className="font-semibold text-slate-900">GET</span> /api/public/properties/list/</li>
                                            <li><span className="font-semibold text-slate-900">GET</span> /api/public/properties/detail/&lt;id&gt;/</li>
                                        </ul>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <p className="font-black text-slate-900">Booking API</p>
                                        <ul className="mt-2 space-y-2 text-sm text-slate-600">
                                            <li><span className="font-semibold text-slate-900">POST</span> /api/public/bookings/create/</li>
                                            <li><span className="font-semibold text-slate-900">GET</span> /api/public/bookings/detail/&lt;id&gt;/</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-black">Booking payload example</h3>
                                <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">{`{
  "property_id": "<property-id>",
  "room_id": "<room-id>",
  "customer_name": "Asha",
  "customer_phone": "9876543210",
  "customer_email": "asha@example.com",
  "amount": 4500,
  "status": "Confirmed"
}`}</pre>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeveloperPage;
