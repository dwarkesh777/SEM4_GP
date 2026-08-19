import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import CameraModal from '@/components/CameraModal';
import { Building2, ArrowLeft, Loader2 } from "lucide-react";
import { API_URL } from "@/lib/api";

const OwnerSignupPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        businessName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [showCamera, setShowCamera] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { toast } = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!formData.businessName.trim()) newErrors.businessName = 'Business Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone Number is required';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInitialSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setShowCamera(true);
        } else {
            toast({
                title: "Validation Error",
                description: "Please fill all required fields correctly.",
                variant: "destructive",
            });
        }
    };

    const handleCaptureComplete = async (facePhotoUrl) => {
        setIsSubmitting(true);

        try {
            const payload = {
                fullName: formData.fullName,
                business_name: formData.businessName,
                email: formData.email,
                phone_number: formData.phone,
                password: formData.password,
                role: "owner",
                face_photo: facePhotoUrl
            };

            const response = await fetch(`${API_URL}/api/auth/signup/owner`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: "Signup Successful",
                    description: "Your partner account has been created. Please log in.",
                });
                navigate('/login?role=owner');
            } else {
                throw new Error(data.error || data.detail || 'Signup failed');
            }
        } catch (error) {
            toast({
                title: "Registration Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Link
                to="/"
                className="absolute top-8 left-8 flex items-center gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
            </Link>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Partner with Us
                </h2>
                <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    List your property and reach thousands of students
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-zinc-900 py-8 px-4 shadow-xl shadow-black/5 ring-1 ring-zinc-900/5 sm:rounded-2xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleInitialSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <Input
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={errors.fullName ? "border-red-500" : ""}
                                    placeholder="John Doe"
                                />
                                {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Business / Property Name
                            </label>
                            <div className="mt-1">
                                <Input
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    className={errors.businessName ? "border-red-500" : ""}
                                    placeholder="Doe Residences"
                                />
                                {errors.businessName && <p className="mt-1 text-sm text-red-500">{errors.businessName}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Email address
                            </label>
                            <div className="mt-1">
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={errors.email ? "border-red-500" : ""}
                                    placeholder="john@example.com"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Phone Number
                            </label>
                            <div className="mt-1">
                                <Input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={errors.phone ? "border-red-500" : ""}
                                    placeholder="9876543210"
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <Input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={errors.password ? "border-red-500" : ""}
                                    placeholder="••••••••"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <Input
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={errors.confirmPassword ? "border-red-500" : ""}
                                    placeholder="••••••••"
                                />
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        <div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Create Partner Account"
                                )}
                            </Button>
                        </div>

                        <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                            For security, you must capture a face photo before submission.
                        </p>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500">
                                    Already a partner?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link to="/login?role=owner" className="font-medium text-primary hover:text-primary/80 transition-colors">
                                Sign in as Owner
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {showCamera && (
                <CameraModal
                    onClose={() => setShowCamera(false)}
                    onCaptureComplete={handleCaptureComplete}
                />
            )}
        </div>
    );
};

export default OwnerSignupPage;
