import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, KeyRound, CheckCircle2, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

const ForgotPasswordModal = ({ isOpen, onClose, initialEmail = "" }) => {
    const { toast } = useToast();
    const [step, setStep] = useState(1); // 1: Send OTP, 2: Enter OTP & New Password, 3: Success
    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e) => {
        if (e) e.preventDefault();
        if (!email.trim()) {
            toast({ title: "Email Required", description: "Please enter your registered email address.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/send-otp/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() })
            });
            const data = await res.json();
            if (res.ok) {
                toast({
                    title: "OTP Sent to Email! ✉️",
                    description: "Check your inbox for a 6-digit OTP code.",
                });
                setStep(2);
            } else {
                toast({
                    title: "Error Sending OTP",
                    description: data.error || "No account found with this email.",
                    variant: "destructive"
                });
            }
        } catch (err) {
            toast({
                title: "Network Error",
                description: "Failed to connect to server. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!otp.trim()) {
            toast({ title: "OTP Required", description: "Please enter the 6-digit OTP code sent to your email.", variant: "destructive" });
            return;
        }
        if (!newPassword) {
            toast({ title: "Password Required", description: "Please enter your new password.", variant: "destructive" });
            return;
        }
        if (newPassword.length < 6) {
            toast({ title: "Weak Password", description: "Password must be at least 6 characters long.", variant: "destructive" });
            return;
        }
        if (newPassword !== confirmPassword) {
            toast({ title: "Password Mismatch", description: "New password and confirm password do not match.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/reset-password-otp/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim(),
                    otp: otp.trim(),
                    new_password: newPassword
                })
            });
            const data = await res.json();
            if (res.ok) {
                toast({
                    title: "Password Updated! 🎉",
                    description: "Your new password has been saved to database. You can now log in.",
                });
                setStep(3);
            } else {
                toast({
                    title: "Reset Failed",
                    description: data.error || "Invalid OTP code or expired session.",
                    variant: "destructive"
                });
            }
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to update password.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md rounded-[2.5rem] bg-white p-8 border-none shadow-2xl overflow-hidden">
                <DialogHeader className="text-center space-y-2 pb-2">
                    <div className="mx-auto w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
                        <KeyRound className="w-7 h-7" />
                    </div>
                    <DialogTitle className="text-2xl font-black text-slate-900 font-heading">
                        {step === 1 && "Forgot Password?"}
                        {step === 2 && "Enter OTP & New Password"}
                        {step === 3 && "Password Reset Complete!"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium text-xs">
                        {step === 1 && "Enter your email to receive a 6-digit verification OTP."}
                        {step === 2 && `Enter the OTP sent to ${email} and set your new password.`}
                        {step === 3 && "Your password has been updated in the database."}
                    </DialogDescription>
                </DialogHeader>

                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="space-y-5 pt-2">
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700 text-xs uppercase tracking-wider ml-1">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-11 py-6 rounded-2xl border-slate-200 focus-visible:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 text-base"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Sending Email OTP...</span>
                            ) : (
                                <span className="flex items-center gap-2">Send OTP Code <ArrowRight className="w-5 h-5" /></span>
                            )}
                        </Button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <Label className="font-bold text-slate-700 text-xs uppercase tracking-wider">6-Digit Email OTP *</Label>
                                <button type="button" onClick={handleSendOTP} className="text-xs font-bold text-blue-600 hover:underline">
                                    Resend OTP
                                </button>
                            </div>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="e.g. 482910"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="pl-11 py-6 rounded-2xl border-slate-200 font-mono tracking-widest text-lg font-bold"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700 text-xs uppercase tracking-wider ml-1">New Password *</Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 6 characters"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="pl-11 pr-11 py-6 rounded-2xl border-slate-200"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700 text-xs uppercase tracking-wider ml-1">Confirm New Password *</Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-11 py-6 rounded-2xl border-slate-200"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 text-base mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Updating Password in DB...</span>
                            ) : (
                                <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Reset Password & Save</span>
                            )}
                        </Button>
                    </form>
                )}

                {step === 3 && (
                    <div className="text-center py-6 space-y-6">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <p className="font-bold text-slate-800 text-lg">Password Updated Successfully!</p>
                            <p className="text-slate-500 text-sm">Your new password is now active in the database. Please log in with your new password.</p>
                        </div>
                        <Button
                            onClick={handleClose}
                            className="w-full py-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md"
                        >
                            Back to Login
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ForgotPasswordModal;
