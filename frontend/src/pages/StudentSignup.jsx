import { useState, useRef, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Mail, Lock, User, ArrowRight, Camera, RotateCcw, Check, Loader2, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";

// ─── Cloudinary Upload ───────────────────────────────────────────────────────
const uploadToCloudinary = async (dataUrl) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) throw new Error("Cloudinary env vars missing. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env");
    const blob = await fetch(dataUrl).then(r => r.blob());
    const fd = new FormData();
    fd.append("file", blob);
    fd.append("upload_preset", uploadPreset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
    const data = await res.json();
    if (!data.secure_url) {
        const errMsg = data.error?.message || JSON.stringify(data);
        console.error("Cloudinary error:", data);
        throw new Error(`Cloudinary: ${errMsg}`);
    }
    return data.secure_url;
};

// ─── Camera Modal ─────────────────────────────────────────────────────────────
const CameraModal = ({ onClose, onConfirm }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [captured, setCaptured] = useState(null);
    const [uploading, setUploading] = useState(false);

    const startCam = useCallback(async () => {
        try {
            const s = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(s);
            if (videoRef.current) videoRef.current.srcObject = s;
        } catch {
            toast.error("Camera access denied. Please allow camera permissions.");
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        startCam();
        return () => stream?.getTracks().forEach(t => t.stop());
    }, []); // eslint-disable-line

    const stopCam = () => stream?.getTracks().forEach(t => t.stop());

    const capture = () => {
        const v = videoRef.current, c = canvasRef.current;
        if (!v || !c) return;
        c.width = v.videoWidth; c.height = v.videoHeight;
        c.getContext("2d").drawImage(v, 0, 0);
        setCaptured(c.toDataURL("image/jpeg"));
    };

    const confirm = async () => {
        setUploading(true);
        try {
            const url = await uploadToCloudinary(captured);
            stopCam();
            onConfirm(url);
        } catch (e) {
            toast.error(e.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden"
            >
                <div className="bg-primary px-6 py-5 text-center">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Camera className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-black text-white">Face Verification</h2>
                    <p className="text-white/70 text-sm mt-1">Take a clear photo of your face</p>
                </div>

                <div className="p-6">
                    <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden mb-5">
                        {!captured ? (
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        ) : (
                            <img src={captured} alt="Captured" className="w-full h-full object-cover" />
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                        {!captured && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-40 h-48 border-2 border-white/50 rounded-full opacity-60" />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        {!captured ? (
                            <Button onClick={capture} className="w-full py-6 rounded-2xl bg-primary text-white font-bold text-lg">
                                <Camera className="mr-2 w-5 h-5" /> Capture Photo
                            </Button>
                        ) : (
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setCaptured(null)} disabled={uploading} className="flex-1 py-6 rounded-2xl font-bold">
                                    <RotateCcw className="mr-2 w-4 h-4" /> Retake
                                </Button>
                                <Button onClick={confirm} disabled={uploading} className="flex-1 py-6 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold">
                                    {uploading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Uploading...</> : <><Check className="mr-2 w-4 h-4" /> Confirm</>}
                                </Button>
                            </div>
                        )}
                        <Button variant="ghost" onClick={() => { stopCam(); onClose(); }} disabled={uploading} className="rounded-2xl text-slate-500">
                            Cancel
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// ─── Student Signup Page ──────────────────────────────────────────────────────
const StudentSignup = () => {
    const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
    const [errors, setErrors] = useState({});
    const [showCamera, setShowCamera] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const e = {};
        if (!formData.fullName.trim()) e.fullName = "Full name is required";
        if (!formData.email.trim()) e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Email is invalid";
        if (!formData.phone.trim()) e.phone = "Phone number is required";
        if (!formData.password) e.password = "Password is required";
        else if (formData.password.length < 6) e.password = "Min 6 characters";
        if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords don't match";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) setShowCamera(true);
    };

    const handleCapture = async (facePhotoUrl) => {
        setShowCamera(false);
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/signup/user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: formData.fullName,
                    email: formData.email,
                    phone_number: formData.phone,
                    password: formData.password,
                    face_photo: facePhotoUrl,
                })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Account created successfully! Please login.");
                navigate("/login?role=student");
            } else {
                const msg = data.email?.[0] || data.detail || data.error || "Registration failed.";
                toast.error(msg.includes("already exists") ? "This email is already registered." : msg);
            }
        } catch {
            toast.error("Network error: Backend server is unreachable.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4 pt-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
                <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2rem] overflow-hidden">
                    <CardHeader className="space-y-1 pb-8 text-center bg-white">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                            <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-black text-slate-900 font-heading">Start Journey</CardTitle>
                        <CardDescription className="text-slate-500 font-medium tracking-tight">Create your account to start exploring.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-2 bg-white px-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {[
                                { id: "fullName", label: "Full Name", icon: User, placeholder: "John Doe" },
                                { id: "email", label: "Email Address", icon: Mail, type: "email", placeholder: "name@example.com" },
                                { id: "phone", label: "Phone Number", icon: Phone, placeholder: "9876543210" },
                                { id: "password", label: "Password", icon: Lock, type: "password", placeholder: "••••••••" },
                                { id: "confirmPassword", label: "Confirm Password", icon: Lock, type: "password", placeholder: "••••••••" },
                            ].map(({ id, label, icon: Icon, type = "text", placeholder }) => (
                                <div key={id} className="space-y-1">
                                    <Label htmlFor={id} className="font-bold text-slate-700 ml-1">{label}</Label>
                                    <div className="relative group">
                                        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-primary" />
                                        <Input
                                            id={id} type={type} placeholder={placeholder}
                                            className={`pl-11 py-6 rounded-2xl border-slate-200 focus:ring-primary/20 ${errors[id] ? "border-red-400" : ""}`}
                                            value={formData[id]}
                                            onChange={e => { setFormData({ ...formData, [id]: e.target.value }); if (errors[id]) setErrors({ ...errors, [id]: "" }); }}
                                        />
                                    </div>
                                    {errors[id] && <p className="text-xs text-red-500 ml-1">{errors[id]}</p>}
                                </div>
                            ))}
                            <div className="pt-1 pb-1 text-center">
                                <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                                    <Camera className="w-3 h-3" /> A face photo will be captured before submission
                                </p>
                            </div>
                            <Button type="submit" disabled={loading}
                                className="w-full py-7 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-[0.98] mt-2">
                                {loading ? <><Loader2 className="mr-2 w-5 h-5 animate-spin" /> Creating account...</> : <>Create Account <ArrowRight className="ml-2 w-5 h-5" /></>}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="bg-slate-50/50 p-8 pt-6 flex justify-center border-t border-slate-100">
                        <div className="text-sm font-medium text-slate-500">
                            Already have an account?{" "}
                            <Link to="/login?role=student" className="text-primary font-bold hover:underline transition-all">Log in</Link>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>

            <AnimatePresence>
                {showCamera && <CameraModal onClose={() => setShowCamera(false)} onConfirm={handleCapture} />}
            </AnimatePresence>
        </div>
    );
};

export default StudentSignup;
