import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Building2,
    MapPin,
    ArrowLeft,
    Plus,
    ChevronRight,
    ChevronLeft,
    Info,
    IndianRupee,
    CheckCircle2,
    Image as ImageIcon,
    Bed,
    X,
    Upload,
    Phone,
    Mail,
    Globe,
    Video
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const steps = [
    { id: 1, title: "Basic Info", subtitle: "STEP 01", icon: Info },
    { id: 2, title: "Pricing", subtitle: "STEP 02", icon: IndianRupee },
    { id: 3, title: "Amenities", subtitle: "STEP 03", icon: CheckCircle2 },
    { id: 4, title: "Media", subtitle: "STEP 04", icon: ImageIcon },
    { id: 5, title: "Rooms", subtitle: "STEP 05", icon: Bed },
];

const AMENITIES_LIST = [
    "wifi", "fully_furnished", "ac", "tv", "laundry",
    "hot_water", "house_keeping", "mattress", "parking",
    "security", "food", "gym"
];

const APPLIANCES_LIST = [
    "tv_app", "geyser", "lamps", "fridge", "ac_app",
    "fans", "iron", "induction", "washing_machine",
    "water_purifier", "microwave", "router"
];

const AddProperty = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        type: "Hostel",
        city: "Ahmedabad",
        location: "", // Area
        gender: "Boys",
        address: "",
        latitude: "",
        longitude: "",
        phone: "",
        email: user?.email || "",
        price: "",
        originalPrice: "",
        description: "",
        amenities: [],
        appliances: [],
        rooms: [{ name: "Standard Room", beds: 1, occupancy: "Single", price: "", is_ac: "Non-AC", available: true }]
    });

    const [mainImage, setMainImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [extraImages, setExtraImages] = useState([]);
    const [extraImagesPreviews, setExtraImagesPreviews] = useState([]);
    const [video, setVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    const fileInputRef = useRef(null);
    const extraFilesInputRef = useRef(null);
    const videoInputRef = useRef(null);

    if (!user?.is_owner) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md border border-slate-100">
                    <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <X className="w-10 h-10 text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Access Denied</h2>
                    <p className="text-slate-500 font-medium mb-8">Only property owners can access the owner system and list properties.</p>
                    <Button onClick={() => navigate("/")} className="w-full bg-primary py-6 rounded-2xl font-bold">Go Back Home</Button>
                </div>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleItem = (listName, item) => {
        setFormData(prev => {
            const list = prev[listName];
            if (list.includes(item)) {
                return { ...prev, [listName]: list.filter(i => i !== item) };
            } else {
                return { ...prev, [listName]: [...list, item] };
            }
        });
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImage(file);
            setMainImagePreview(URL.createObjectURL(file));
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideo(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const handleRoomChange = (index, field, value) => {
        const updatedRooms = [...formData.rooms];
        updatedRooms[index][field] = value;
        setFormData(prev => ({ ...prev, rooms: updatedRooms }));
    };

    const addRoom = () => {
        setFormData(prev => ({
            ...prev,
            rooms: [...prev.rooms, { name: "", beds: 1, occupancy: "Single", price: "", is_ac: "Non-AC", available: true }]
        }));
    };

    const removeRoom = (index) => {
        if (formData.rooms.length > 1) {
            setFormData(prev => ({
                ...prev,
                rooms: prev.rooms.filter((_, i) => i !== index)
            }));
        }
    };

    const nextStep = () => {
        if (currentStep < 5) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const submitData = new FormData();

            // Basic Fields
            Object.keys(formData).forEach(key => {
                if (key !== 'rooms' && key !== 'amenities' && key !== 'appliances') {
                    submitData.append(key, formData[key]);
                }
            });

            // Handle Arrays (Backend expects multiple values for same key or specific format)
            formData.amenities.forEach(a => submitData.append('amenities', a));
            formData.appliances.forEach(a => submitData.append('appliances', a));

            // Rooms as JSON string
            submitData.append('rooms_json', JSON.stringify(formData.rooms));

            // Images & Video
            if (mainImage) submitData.append('main_image', mainImage);
            if (video) submitData.append('video', video);
            extraImages.forEach(img => submitData.append('uploaded_images', img));

            const response = await fetch("http://localhost:8000/api/properties/", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                    // Don't set Content-Type, browser does it for FormData
                },
                body: submitData
            });

            if (response.ok) {
                toast.success("Property listed successfully!");
                navigate("/");
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.error || errorData.detail || "Listing failed. Please check server.");
            }
        } catch (error) {
            console.error("Submission failed:", error);
            toast.error(`Error: ${error.message || "Something went wrong"}. Check if backend is running at http://localhost:8000`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            <div className="container px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col mb-12">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-3">
                        <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center">
                            <Building2 className="w-3 h-3" />
                        </div>
                        Owner System
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 mb-4 font-heading tracking-tight">
                        List Your <span className="text-primary italic">Property</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg max-w-xl leading-relaxed">
                        Join our premium network of hostels and PGs. Reach thousands of students looking for a second home.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Sidebar Steps */}
                    <div className="lg:col-span-3 flex flex-col gap-4 relative">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;

                            return (
                                <div key={step.id} className="relative flex items-center gap-6 group">
                                    {index !== steps.length - 1 && (
                                        <div className={`absolute left-[27px] top-14 w-0.5 h-6 transition-colors duration-500 ${isCompleted ? "bg-primary" : "bg-slate-100"}`} />
                                    )}
                                    <button
                                        onClick={() => isCompleted && setCurrentStep(step.id)}
                                        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${isActive
                                            ? "bg-primary border-primary shadow-xl shadow-primary/30"
                                            : isCompleted
                                                ? "bg-white border-primary/20 text-primary"
                                                : "bg-white border-slate-100 text-slate-300"
                                            }`}
                                    >
                                        <Icon className={`w-6 h-6 ${isActive ? "text-white" : ""}`} />
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-step-ring"
                                                className="absolute -inset-2 border-2 border-primary/20 rounded-[1.5rem]"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </button>
                                    <div className="flex flex-col">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-primary" : "text-slate-400"}`}>
                                            {step.subtitle}
                                        </span>
                                        <span className={`text-lg font-bold leading-none ${isActive ? "text-slate-900" : "text-slate-400"}`}>
                                            {step.title}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Main Form Area */}
                    <div className="lg:col-span-9 bg-white">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="bg-slate-50/50 border border-slate-100 rounded-[3rem] p-10 md:p-14"
                            >
                                {currentStep === 1 && (
                                    <div className="space-y-12">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                                <Info className="w-6 h-6 text-primary" />
                                            </div>
                                            <h2 className="text-3xl font-black text-slate-800 font-heading">Basic Information</h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold text-slate-700 ml-1">Property Name</Label>
                                                <Input
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter property name"
                                                    className="h-16 rounded-2xl border-slate-200 bg-white focus:ring-primary/20 transition-all font-medium text-lg px-6"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold text-slate-700 ml-1">Property Type</Label>
                                                <Select onValueChange={(v) => handleSelectChange('type', v)} defaultValue={formData.type}>
                                                    <SelectTrigger className="h-16 rounded-2xl border-slate-200 bg-white focus:ring-primary/20 transition-all font-medium text-lg px-6">
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl shadow-xl border-slate-100">
                                                        <SelectItem value="Hostel" className="font-bold py-3">Hostel</SelectItem>
                                                        <SelectItem value="PG" className="font-bold py-3">PG</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold text-slate-700 ml-1">City</Label>
                                                <Input
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g. Ahmedabad"
                                                    className="h-16 rounded-2xl border-slate-200 bg-white focus:ring-primary/20 transition-all font-medium text-lg px-6"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold text-slate-700 ml-1">Location/Area</Label>
                                                <Input
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g. Navarangpura"
                                                    className="h-16 rounded-2xl border-slate-200 bg-white focus:ring-primary/20 transition-all font-medium text-lg px-6"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold text-slate-700 ml-1">Type (Gender)</Label>
                                                <Select onValueChange={(v) => handleSelectChange('gender', v)} defaultValue={formData.gender}>
                                                    <SelectTrigger className="h-16 rounded-2xl border-slate-200 bg-white focus:ring-primary/20 transition-all font-medium text-lg px-6">
                                                        <SelectValue placeholder="Select target gender" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl shadow-xl border-slate-100">
                                                        <SelectItem value="Boys" className="font-bold py-3">Boys</SelectItem>
                                                        <SelectItem value="Girls" className="font-bold py-3">Girls</SelectItem>
                                                        <SelectItem value="Co-ed" className="font-bold py-3">Co-ed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <Label className="text-sm font-bold text-slate-700 ml-1">Full Address</Label>
                                                <Textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    placeholder="Complete address with street, building number, etc."
                                                    className="min-h-[120px] rounded-3xl border-slate-200 bg-white focus:ring-primary/20 transition-all font-medium text-lg p-6 resize-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-10 border-t border-slate-100">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                                    <MapPin className="w-5 h-5 text-blue-500" />
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-800 font-heading tracking-tight">Location Coordinates</h3>
                                                <span className="text-xs font-bold text-slate-400">Help students find you on the map</span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <Label className="text-sm font-bold text-slate-700 ml-1">Latitude</Label>
                                                    <Input
                                                        name="latitude"
                                                        value={formData.latitude}
                                                        onChange={handleInputChange}
                                                        placeholder="e.g. 23.0225"
                                                        className="h-16 rounded-2xl border-slate-200 bg-white focus:ring-primary/20 transition-all font-medium text-lg px-6"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-sm font-bold text-slate-700 ml-1">Longitude</Label>
                                                    <Input
                                                        name="longitude"
                                                        value={formData.longitude}
                                                        onChange={handleInputChange}
                                                        placeholder="e.g. 72.5714"
                                                        className="h-16 rounded-2xl border-slate-200 bg-white focus:ring-primary/20 transition-all font-medium text-lg px-6"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-10 border-t border-slate-100">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                                    <Phone className="w-5 h-5 text-indigo-500" />
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-800 font-heading tracking-tight">Contact Details</h3>
                                                <span className="text-xs font-bold text-slate-400">How students will reach out to you</span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <Label className="text-sm font-bold text-slate-700 ml-1">Contact Phone</Label>
                                                    <Input
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        placeholder="+91 98765 43210"
                                                        className="h-16 rounded-2xl border-slate-200 bg-white focus:ring-primary/20 transition-all font-medium text-lg px-6"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-sm font-bold text-slate-700 ml-1">Contact Email</Label>
                                                    <Input
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        placeholder="contact@example.com"
                                                        className="h-16 rounded-2xl border-slate-200 bg-white focus:ring-primary/20 transition-all font-medium text-lg px-6"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-12 min-h-[500px]">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                                <IndianRupee className="w-6 h-6 text-primary" />
                                            </div>
                                            <h2 className="text-3xl font-black text-slate-800 font-heading">Starting Price</h2>
                                        </div>
                                        <p className="text-slate-500 font-medium">Base monthly price for your property</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <Label className="text-sm font-bold text-slate-700 ml-1">Monthly Starting Price *</Label>
                                                <div className="relative">
                                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">₹</div>
                                                    <Input
                                                        name="price"
                                                        type="number"
                                                        value={formData.price}
                                                        onChange={handleInputChange}
                                                        placeholder="5000"
                                                        className="h-20 rounded-2xl border-slate-200 bg-white focus:ring-primary/20 transition-all font-black text-2xl pl-12 pr-6"
                                                    />
                                                </div>
                                                <p className="text-xs font-bold text-slate-400 ml-1 italic">This is the main price displayed in listings</p>
                                            </div>
                                            <div className="space-y-4">
                                                <Label className="text-sm font-bold text-slate-700 ml-1">Original Price (Optional)</Label>
                                                <div className="relative">
                                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">₹</div>
                                                    <Input
                                                        name="originalPrice"
                                                        type="number"
                                                        value={formData.originalPrice}
                                                        onChange={handleInputChange}
                                                        placeholder="6000"
                                                        className="h-20 rounded-2xl border-slate-200 bg-white focus:ring-primary/20 transition-all font-black text-2xl pl-12 pr-6"
                                                    />
                                                </div>
                                                <p className="text-xs font-bold text-slate-400 ml-1 italic">Show discount with strikethrough price</p>
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <Label className="text-sm font-bold text-slate-700 ml-1">Short Description</Label>
                                                <Textarea
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    placeholder="Tell students what makes your property special..."
                                                    className="min-h-[160px] rounded-[2.5rem] border-slate-200 bg-white focus:ring-primary/20 transition-all font-medium text-lg p-8 resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-12">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                                    <CheckCircle2 className="w-6 h-6 text-primary" />
                                                </div>
                                                <h2 className="text-3xl font-black text-slate-800 font-heading">Amenities & Appliances</h2>
                                            </div>
                                            <p className="text-slate-500 font-medium ml-1">Select everything your property offers</p>
                                        </div>

                                        <div className="space-y-10">
                                            <div className="space-y-6">
                                                <h3 className="text-xl font-black text-slate-900 border-l-4 border-primary pl-4 py-1">Core Amenities</h3>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    {AMENITIES_LIST.map((item) => (
                                                        <button
                                                            key={item}
                                                            onClick={() => toggleItem('amenities', item)}
                                                            className={`p-4 rounded-2xl border-2 transition-all duration-300 font-bold text-sm tracking-tight flex items-center justify-center border-dashed ${formData.amenities.includes(item)
                                                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105"
                                                                : "bg-white border-slate-100 text-slate-400 hover:border-primary/30 hover:text-primary"
                                                                }`}
                                                        >
                                                            {item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-6 pt-6">
                                                <h3 className="text-xl font-black text-slate-900 border-l-4 border-accent pl-4 py-1">Electrical Appliances</h3>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    {APPLIANCES_LIST.map((item) => (
                                                        <button
                                                            key={item}
                                                            onClick={() => toggleItem('appliances', item)}
                                                            className={`p-4 rounded-2xl border-2 transition-all duration-300 font-bold text-sm tracking-tight flex items-center justify-center border-dashed ${formData.appliances.includes(item)
                                                                ? "bg-accent border-accent text-white shadow-lg shadow-accent/20 scale-105"
                                                                : "bg-white border-slate-100 text-slate-400 hover:border-accent/30 hover:text-accent"
                                                                }`}
                                                        >
                                                            {item.replace(/_app/g, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 4 && (
                                    <div className="space-y-12">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                                    <ImageIcon className="w-6 h-6 text-primary" />
                                                </div>
                                                <h2 className="text-3xl font-black text-slate-800 font-heading">Property Media</h2>
                                            </div>
                                            <p className="text-slate-500 font-medium ml-1">High-quality photos help your property stand out</p>
                                        </div>

                                        <div className="space-y-12">
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl font-black text-slate-900">Main Banner Image</h3>
                                                    {mainImage && (
                                                        <Button variant="ghost" className="text-orange-600 font-bold" onClick={() => { setMainImage(null); setMainImagePreview(null); }}>
                                                            Remove
                                                        </Button>
                                                    )}
                                                </div>

                                                {!mainImagePreview ? (
                                                    <div
                                                        onClick={() => fileInputRef.current.click()}
                                                        className="aspect-[21/9] rounded-[2.5rem] border-4 border-dashed border-slate-100 bg-white flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-slate-50 transition-all hover:border-primary/20 group"
                                                    >
                                                        <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                            <Upload className="w-8 h-8 text-primary" />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-xl font-black text-slate-900">Upload Main Image</p>
                                                            <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-[10px]">JPG, PNG or WEBP (Max 5MB)</p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            ref={fileInputRef}
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={handleMainImageChange}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="relative aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                                                        <img src={mainImagePreview} className="w-full h-full object-cover" alt="Preview" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-6 pt-10 border-t border-slate-100">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl font-black text-slate-900">Virtual Tour / Video</h3>
                                                    {video && (
                                                        <Button variant="ghost" className="text-orange-600 font-bold" onClick={() => { setVideo(null); setVideoPreview(null); }}>
                                                            Remove Video
                                                        </Button>
                                                    )}
                                                </div>

                                                {!videoPreview ? (
                                                    <div
                                                        onClick={() => videoInputRef.current.click()}
                                                        className="aspect-video rounded-[2.5rem] border-4 border-dashed border-slate-100 bg-white flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-slate-50 transition-all hover:border-accent/20 group"
                                                    >
                                                        <div className="w-20 h-20 bg-accent/5 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                            <Video className="w-8 h-8 text-accent" />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-xl font-black text-slate-900">Upload Property Video</p>
                                                            <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-[10px]">MP4, WEBM or OGG (Max 20MB) • Optional</p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            ref={videoInputRef}
                                                            className="hidden"
                                                            accept="video/*"
                                                            onChange={handleVideoChange}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-black">
                                                        <video src={videoPreview} className="w-full h-full object-cover" controls />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-6 pt-10 border-t border-slate-100">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl font-black text-slate-900">Gallery Photos</h3>
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Optional</span>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                    {extraImagesPreviews.map((prev, idx) => (
                                                        <div key={idx} className="relative aspect-square rounded-3xl overflow-hidden shadow-md group border-2 border-white">
                                                            <img src={prev} className="w-full h-full object-cover" />
                                                            <button
                                                                className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-md rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={() => {
                                                                    setExtraImages(prevImgs => prevImgs.filter((_, i) => i !== idx));
                                                                    setExtraImagesPreviews(prevPrevs => prevPrevs.filter((_, i) => i !== idx));
                                                                }}
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={() => extraFilesInputRef.current.click()}
                                                        className="aspect-square rounded-3xl border-4 border-dashed border-slate-100 bg-white flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all hover:border-primary/20"
                                                    >
                                                        <Plus className="w-8 h-8 text-slate-200" />
                                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Add Photo</span>
                                                    </button>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        ref={extraFilesInputRef}
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const files = Array.from(e.target.files);
                                                            setExtraImages(prev => [...prev, ...files]);
                                                            setExtraImagesPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 5 && (
                                    <div className="space-y-12">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                                    <Bed className="w-6 h-6 text-primary" />
                                                </div>
                                                <h2 className="text-3xl font-black text-slate-800 font-heading">Room Management</h2>
                                            </div>
                                            <p className="text-slate-500 font-medium ml-1">Define the types of rooms available in your property</p>
                                        </div>

                                        <div className="space-y-8">
                                            {formData.rooms.map((room, idx) => (
                                                <div key={idx} className="relative p-10 bg-white rounded-[2rem] border-2 border-slate-100 shadow-sm transition-all hover:border-primary/10 group">
                                                    {formData.rooms.length > 1 && (
                                                        <button
                                                            onClick={() => removeRoom(idx)}
                                                            className="absolute top-6 right-6 w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-600 hover:text-white"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    )}

                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                                        <div className="space-y-3 lg:col-span-2">
                                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Room Category Name</Label>
                                                            <Input
                                                                value={room.name}
                                                                onChange={(e) => handleRoomChange(idx, 'name', e.target.value)}
                                                                placeholder="e.g. Deluxe Triple Sharing"
                                                                className="h-14 rounded-xl border-slate-100 bg-slate-50/50 focus:ring-primary/20 font-bold"
                                                            />
                                                        </div>
                                                        <div className="space-y-3">
                                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Occupancy</Label>
                                                            <Select onValueChange={(v) => handleRoomChange(idx, 'occupancy', v)} defaultValue={room.occupancy}>
                                                                <SelectTrigger className="h-14 rounded-xl border-slate-100 bg-slate-50/50 font-bold">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="rounded-xl font-bold">
                                                                    <SelectItem value="Single">Single</SelectItem>
                                                                    <SelectItem value="Double Sharing">Double Sharing</SelectItem>
                                                                    <SelectItem value="Triple Sharing">Triple Sharing</SelectItem>
                                                                    <SelectItem value="Four Sharing">Four Sharing</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Monthly Cost</Label>
                                                            <div className="relative">
                                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</div>
                                                                <Input
                                                                    type="number"
                                                                    value={room.price}
                                                                    onChange={(e) => handleRoomChange(idx, 'price', e.target.value)}
                                                                    placeholder="0"
                                                                    className="h-14 rounded-xl border-slate-100 bg-slate-50/50 pl-10 font-black"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Beds</Label>
                                                            <Input 
                                                                type="number"
                                                                value={room.beds}
                                                                onChange={(e) => handleRoomChange(idx, 'beds', parseInt(e.target.value))}
                                                                className="h-14 rounded-xl border-slate-100 bg-slate-50/50 font-black"
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-4 pt-4 lg:col-span-4">
                                                            <Select onValueChange={(v) => handleRoomChange(idx, 'is_ac', v)} defaultValue={room.is_ac}>
                                                                <SelectTrigger className={`h-12 px-6 rounded-xl font-bold transition-all border-2 ${
                                                                    room.is_ac === 'AC' 
                                                                    ? "bg-blue-50 border-blue-200 text-blue-600" 
                                                                    : "bg-slate-50 border-slate-100 text-slate-500"
                                                                }`}>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="rounded-xl font-bold">
                                                                    <SelectItem value="AC">AC Room</SelectItem>
                                                                    <SelectItem value="Non-AC">Non-AC Room</SelectItem>
                                                                </SelectContent>
                                                            </Select>

                                                            <button 
                                                                onClick={() => handleRoomChange(idx, 'available', !room.available)}
                                                                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all h-12 ${
                                                                    room.available 
                                                                    ? "bg-green-50 text-green-600 border-2 border-green-100" 
                                                                    : "bg-slate-100 text-slate-400 border-2 border-transparent"
                                                                }`}
                                                            >
                                                                <div className={`w-3 h-3 rounded-full ${room.available ? "bg-green-500 animate-pulse" : "bg-slate-300"}`} />
                                                                {room.available ? "Available" : "Sold Out"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <Button
                                                variant="outline"
                                                className="w-full h-20 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 font-black gap-3 hover:border-primary/30 hover:text-primary hover:bg-slate-50"
                                                onClick={addRoom}
                                            >
                                                <Plus className="w-5 h-5" /> Add Another Room Type
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Footer */}
                        <div className="mt-12 flex items-center justify-between bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50">
                            <Button
                                variant="ghost"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="h-16 px-10 rounded-2xl font-black gap-3 text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"
                            >
                                <ChevronLeft className="w-5 h-5" /> Back
                            </Button>

                            {currentStep < 5 ? (
                                <Button
                                    onClick={nextStep}
                                    className="h-16 px-12 rounded-2xl bg-slate-900 hover:bg-black text-white font-black gap-3 shadow-xl transition-all active:scale-95"
                                >
                                    Next Step <ChevronRight className="w-5 h-5" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="h-20 px-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black gap-4 shadow-2xl shadow-primary/30 transition-all active:scale-95"
                                >
                                    {loading ? "Listing Property..." : "Finalize & List Property"}
                                    <Globe className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProperty;
