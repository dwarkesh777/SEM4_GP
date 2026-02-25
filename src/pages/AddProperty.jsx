import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building2,
    Image as ImageIcon,
    Video,
    MapPin,
    Phone,
    Mail,
    ChevronRight,
    ChevronLeft,
    Plus,
    X,
    Upload,
    Check,
    Info,
    LayoutDashboard,
    Wifi,
    Tv,
    Wind,
    Utensils,
    Shield,
    Car,
    Dumbbell,
    Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const amenitiesList = [
    { id: "wifi", label: "WiFi", icon: <Wifi className="w-4 h-4" /> },
    { id: "fully_furnished", label: "Fully Furnished", icon: <Building2 className="w-4 h-4" /> },
    { id: "ac", label: "AC", icon: <Wind className="w-4 h-4" /> },
    { id: "tv", label: "TV", icon: <Tv className="w-4 h-4" /> },
    { id: "laundry", label: "Laundry", icon: <Info className="w-4 h-4" /> },
    { id: "hot_water", label: "Hot Water", icon: <Info className="w-4 h-4" /> },
    { id: "house_keeping", label: "House Keeping", icon: <Info className="w-4 h-4" /> },
    { id: "mattress", label: "Mattress", icon: <Info className="w-4 h-4" /> },
    { id: "parking", label: "Parking", icon: <Car className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
    { id: "food", label: "Food", icon: <Utensils className="w-4 h-4" /> },
    { id: "gym", label: "Gym", icon: <Dumbbell className="w-4 h-4" /> },
];

const appliancesList = [
    { id: "tv_app", label: "TV" },
    { id: "geyser", label: "Geyser" },
    { id: "lamps", label: "Lamps" },
    { id: "fridge", label: "Fridge" },
    { id: "ac_app", label: "AC" },
    { id: "fans", label: "Fans" },
    { id: "iron", label: "Iron" },
    { id: "induction", label: "Induction" },
    { id: "washing_machine", label: "Washing Machine" },
    { id: "water_purifier", label: "Water Purifier" },
    { id: "microwave", label: "Microwave" },
    { id: "router", label: "Router" },
];

const AddProperty = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const steps = [
        { id: 1, title: "Basic Info", icon: <Info className="w-4 h-4" />, description: "Property details & location" },
        { id: 2, title: "Amenities", icon: <Check className="w-4 h-4" />, description: "Facilities & appliances" },
        { id: 3, title: "Media", icon: <ImageIcon className="w-4 h-4" />, description: "Photos & video tour" },
        { id: 4, title: "Pricing", icon: <Building2 className="w-4 h-4" />, description: "Room types & rates" },
    ];

    // Redirect if not owner
    useEffect(() => {
        if (!loading && (!user || !user.is_owner)) {
            toast.error("Unauthorized: Only owners can list properties");
            navigate("/owner-login");
        }
    }, [user, loading, navigate]);

    const [formData, setFormData] = useState({
        name: "",
        type: "Hostel",
        city: "",
        location: "",
        gender: "Boys",
        address: "",
        price: "",
        original_price: "",
        description: "",
        latitude: "",
        longitude: "",
        phone: "",
        email: "",
        main_image_url: "",
        video_url: "",
        amenities: [],
        appliances: [],
    });

    const [roomTypes, setRoomTypes] = useState([
        { id: 1, name: "Double Sharing", regularPrice: "", regularBeds: "", regularAvailable: true, acPrice: "", acBeds: "", acAvailable: true },
        { id: 2, name: "Triple Sharing", regularPrice: "", regularBeds: "", regularAvailable: true, acPrice: "", acBeds: "", acAvailable: true },
        { id: 3, name: "Quadruple Sharing", regularPrice: "", regularBeds: "", regularAvailable: true, acPrice: "", acBeds: "", acAvailable: true },
    ]);

    const [mainImage, setMainImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [extraImages, setExtraImages] = useState([]);
    const [extraImagePreviews, setExtraImagePreviews] = useState([]);
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    const fileInputRef = useRef(null);
    const extraFilesInputRef = useRef(null);
    const videoInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggleAmenity = (id) => {
        setFormData(prev => {
            const current = [...prev.amenities];
            if (current.includes(id)) {
                return { ...prev, amenities: current.filter(item => item !== id) };
            } else {
                return { ...prev, amenities: [...current, id] };
            }
        });
    };

    const handleToggleAppliance = (id) => {
        setFormData(prev => {
            const current = [...prev.appliances];
            if (current.includes(id)) {
                return { ...prev, appliances: current.filter(item => item !== id) };
            } else {
                return { ...prev, appliances: [...current, id] };
            }
        });
    };

    const handleRoomChange = (id, field, value) => {
        setRoomTypes(prev => prev.map(room =>
            room.id === id ? { ...room, [field]: value } : room
        ));
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleExtraImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setExtraImages(prev => [...prev, ...files]);

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setExtraImagePreviews(prev => [...prev, reader.result]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            const url = URL.createObjectURL(file);
            setVideoPreview(url);
        }
    };

    const removeExtraImage = (index) => {
        setExtraImages(prev => prev.filter((_, i) => i !== index));
        setExtraImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Prepare FormData for multipart upload
            const formDataObj = new FormData();

            // Basic fields (skip arrays handled below)
            Object.keys(formData).forEach(key => {
                if (key === 'amenities' || key === 'appliances') return;
                if (formData[key] !== null && formData[key] !== undefined && formData[key] !== "") {
                    formDataObj.append(key, formData[key]);
                }
            });

            // Handle main image
            if (mainImage) {
                formDataObj.append("main_image", mainImage);
            }

            // Handle video
            if (videoFile) {
                formDataObj.append("video", videoFile);
            }

            // Handle multiple images
            extraImages.forEach((file) => {
                formDataObj.append("uploaded_images", file);
            });

            // Handle nested rooms: We need to send these in a way DRF can understand or handle manually
            // One way is to send each amenity/appliance separately
            formData.amenities.forEach(amenity => {
                formDataObj.append("amenities", amenity);
            });
            formData.appliances.forEach(appliance => {
                formDataObj.append("appliances", appliance);
            });

            // For rooms, we'll send it as a JSON string and we might need to handle it in the backend
            // or send as rooms[0]name=...
            const simplifiedRooms = [];
            roomTypes.forEach(room => {
                if (room.regularPrice) {
                    simplifiedRooms.push({
                        name: room.name,
                        beds: parseInt(room.regularBeds) || 0,
                        occupancy: room.name,
                        price: parseInt(room.regularPrice),
                        available: room.regularAvailable
                    });
                }
                if (room.acPrice) {
                    simplifiedRooms.push({
                        name: `${room.name} (AC)`,
                        beds: parseInt(room.acBeds) || 0,
                        occupancy: room.name,
                        price: parseInt(room.acPrice),
                        available: room.acAvailable
                    });
                }
            });

            // DRF's nested serializers usually don't handle JSON strings in MultiPartParser automatically
            // So we'll append each room field if we want to be safe, but simplifiedRooms as JSON is easier if we update the backend to parse it
            formDataObj.append("rooms_json", JSON.stringify(simplifiedRooms));

            const response = await fetch("http://localhost:8000/api/properties/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: formDataObj
            });

            if (response.ok) {
                toast.success("Property listed successfully!");
                navigate("/");
            } else {
                let errorMessage = "Failed to list property";
                try {
                    const err = await response.json();
                    errorMessage = err.error || (typeof err === 'object' ? JSON.stringify(err) : String(err));
                } catch (e) {
                    errorMessage = `Server error (${response.status}): The server encountered an issue.`;
                }
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Network error or invalid data. Please check your inputs.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#F8FAFC]">
            <div className="container max-w-6xl">
                <div className="mb-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-primary font-bold text-sm mb-2"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        OWNER SYSTEM
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 tracking-tight">
                        List Your <span className="text-primary italic">Property</span>
                    </h1>
                    <p className="text-slate-500 mt-3 text-base md:text-lg max-w-2xl font-medium leading-relaxed">
                        Join our premium network of hostels and PGs. Reach thousands of students looking for a second home.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Stepper Sidebar */}
                    <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-32 h-fit">
                        {steps.map((step, idx) => {
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;

                            return (
                                <div
                                    key={step.id}
                                    className="relative flex items-center lg:block"
                                >
                                    <div
                                        className={`relative z-10 p-5 rounded-[1.5rem] transition-all duration-500 border w-full ${isActive
                                                ? "bg-white border-primary shadow-2xl shadow-primary/20 scale-105"
                                                : "bg-transparent border-transparent opacity-60"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="pulse"
                                                        className="absolute inset-0 bg-primary/20 rounded-xl"
                                                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    />
                                                )}
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 relative z-10 ${isActive || isCompleted ? "bg-primary text-white" : "bg-slate-200 text-slate-500"
                                                    }`}>
                                                    {isCompleted ? <Check className="w-5 h-5 animate-in zoom-in duration-300" /> : step.icon}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-bold transition-colors duration-300 ${isActive ? "text-slate-900" : "text-slate-500"}`}>
                                                    {step.title}
                                                </span>
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                                    Step 0{step.id}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {idx !== steps.length - 1 && (
                                        <div className="absolute left-[2.25rem] top-full h-4 w-0.5 -ml-[1px] hidden lg:block overflow-hidden">
                                            <div className="w-full h-full bg-slate-200" />
                                            <motion.div
                                                className="absolute top-0 left-0 w-full bg-primary origin-top"
                                                initial={{ scaleY: 0 }}
                                                animate={{ scaleY: isCompleted ? 1 : 0 }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Form Area */}
                    <div className="lg:col-span-9">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <AnimatePresence mode="wait">
                                {currentStep === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-8"
                                    >
                                        {/* Section 1: Basic Information */}
                                        <div className="bg-background rounded-2xl p-6 md:p-8 shadow-sm border border-border/50">
                                            <div className="flex items-center gap-2 mb-6 text-primary">
                                                <Info className="w-5 h-5" />
                                                <h2 className="text-xl font-heading font-bold">Basic Information</h2>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Property Name</Label>
                                                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter property name" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="type">Property Type</Label>
                                                    <Select value={formData.type} onValueChange={(val) => handleSelectChange('type', val)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Hostel">Hostel</SelectItem>
                                                            <SelectItem value="PG">PG</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="city">City</Label>
                                                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Ahmedabad" required />
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <Label htmlFor="location">Location/Area</Label>
                                                    <Input id="location" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. Navarangpura" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="gender">Type</Label>
                                                    <Select value={formData.gender} onValueChange={(val) => handleSelectChange('gender', val)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select target gender" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Boys">Boys</SelectItem>
                                                            <SelectItem value="Girls">Girls</SelectItem>
                                                            <SelectItem value="Co-ed">Co-ed</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="md:col-span-2 space-y-2">
                                                    <Label htmlFor="address">Full Address</Label>
                                                    <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Complete address with street, building number, etc." className="min-h-[100px] rounded-xl border-slate-100 shadow-sm" required />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 4: Location Coordinates */}
                                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                                            <div className="flex items-center gap-3 mb-8">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <MapPin className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-heading font-bold text-slate-900">Location Coordinates</h2>
                                                    <p className="text-sm text-slate-500 font-medium">Help students find you on the map</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="latitude">Latitude</Label>
                                                    <Input id="latitude" name="latitude" value={formData.latitude} onChange={handleInputChange} placeholder="e.g., 23.0225" className="h-12 rounded-xl border-slate-100 shadow-sm" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="longitude">Longitude</Label>
                                                    <Input id="longitude" name="longitude" value={formData.longitude} onChange={handleInputChange} placeholder="e.g., 72.5714" className="h-12 rounded-xl border-slate-100 shadow-sm" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 5: Contact Information */}
                                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                                            <div className="flex items-center gap-3 mb-8">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <Phone className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-heading font-bold text-slate-900">Contact Details</h2>
                                                    <p className="text-sm text-slate-500 font-medium">How students will reach out to you</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">Contact Phone</Label>
                                                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" required className="h-12 rounded-xl border-slate-100 shadow-sm" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Contact Email</Label>
                                                    <Input id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="contact@example.com" type="email" required className="h-12 rounded-xl border-slate-100 shadow-sm" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-8">
                                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                            <Check className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h2 className="text-xl font-heading font-bold text-slate-900">Amenities</h2>
                                                            <p className="text-sm text-slate-500 font-medium">Select available facilities</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {amenitiesList.map((item) => (
                                                            <div
                                                                key={item.id}
                                                                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${formData.amenities.includes(item.id)
                                                                    ? "bg-primary/5 border-primary/20"
                                                                    : "bg-white border-slate-100 hover:border-slate-200"
                                                                    }`}
                                                                onClick={() => handleToggleAmenity(item.id)}
                                                            >
                                                                <Checkbox
                                                                    id={item.id}
                                                                    checked={formData.amenities.includes(item.id)}
                                                                    onCheckedChange={() => handleToggleAmenity(item.id)}
                                                                    className="rounded-lg"
                                                                />
                                                                <Label htmlFor={item.id} className="text-sm font-bold text-slate-700 flex items-center gap-2 cursor-pointer">
                                                                    {item.icon}
                                                                    {item.label}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-8">
                                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                            <Tv className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h2 className="text-xl font-heading font-bold text-slate-900">Appliances</h2>
                                                            <p className="text-sm text-slate-500 font-medium">Electronic gadgets included</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {appliancesList.map((item) => (
                                                            <div
                                                                key={item.id}
                                                                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${formData.appliances.includes(item.id)
                                                                    ? "bg-primary/5 border-primary/20"
                                                                    : "bg-white border-slate-100 hover:border-slate-200"
                                                                    }`}
                                                                onClick={() => handleToggleAppliance(item.id)}
                                                            >
                                                                <Checkbox
                                                                    id={item.id}
                                                                    checked={formData.appliances.includes(item.id)}
                                                                    onCheckedChange={() => handleToggleAppliance(item.id)}
                                                                    className="rounded-lg"
                                                                />
                                                                <Label htmlFor={item.id} className="text-sm font-bold text-slate-700 cursor-pointer">{item.label}</Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                                            <div className="flex items-center gap-3 mb-8">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <ImageIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-heading font-bold text-slate-900">Property Media</h2>
                                                    <p className="text-sm text-slate-500 font-medium">Showcase your property with high-quality visuals</p>
                                                </div>
                                            </div>

                                            <div className="space-y-10">
                                                {/* Main Image Upload */}
                                                <div className="space-y-4">
                                                    <Label className="text-base font-bold text-slate-800">Main Thumbnail Image</Label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-center group"
                                                        >
                                                            <div className="w-16 h-16 rounded-[1.25rem] bg-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                                                <Upload className="w-8 h-8" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900">Upload Main Image</p>
                                                                <p className="text-xs text-slate-500 font-medium mt-1">This will be the first image shown</p>
                                                            </div>
                                                            <input
                                                                type="file"
                                                                ref={fileInputRef}
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={handleMainImageChange}
                                                            />
                                                        </div>

                                                        {mainImagePreview && (
                                                            <div className="relative rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl aspect-video group">
                                                                <img src={mainImagePreview} alt="Main Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">PRIMARY IMAGE</div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => { setMainImage(null); setMainImagePreview(null); }}
                                                                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-md hover:bg-white p-2.5 rounded-full text-destructive shadow-lg transition-all scale-0 group-hover:scale-100"
                                                                >
                                                                    <X className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Extra Images Upload */}
                                                <div className="space-y-4">
                                                    <Label className="text-base font-bold text-slate-800">Gallery Photos</Label>
                                                    <div
                                                        onClick={() => extraFilesInputRef.current?.click()}
                                                        className="border-2 border-dashed border-slate-100 rounded-2xl p-6 flex items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all w-full"
                                                    >
                                                        <Plus className="w-5 h-5 text-primary" />
                                                        <span className="font-bold text-slate-700">Add More Photos</span>
                                                        <input
                                                            type="file"
                                                            ref={extraFilesInputRef}
                                                            className="hidden"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={handleExtraImagesChange}
                                                        />
                                                    </div>

                                                    {extraImagePreviews.length > 0 && (
                                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
                                                            {extraImagePreviews.map((preview, index) => (
                                                                <div key={index} className="relative rounded-2xl overflow-hidden border-2 border-white shadow-xl aspect-square group">
                                                                    <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeExtraImage(index)}
                                                                        className="absolute top-2 right-2 bg-black/60 backdrop-blur-md hover:bg-destructive p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-50 pt-10">
                                                    <div className="space-y-4">
                                                        <Label className="text-base font-bold text-slate-800">Property Video Tour</Label>
                                                        <div
                                                            onClick={() => videoInputRef.current?.click()}
                                                            className="border-2 border-dashed border-slate-100 rounded-[1.5rem] p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-center"
                                                        >
                                                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                                                                <Video className="w-6 h-6 text-slate-400" />
                                                            </div>
                                                            <p className="font-bold text-slate-700">Upload Video Tour</p>
                                                            <input
                                                                type="file"
                                                                ref={videoInputRef}
                                                                className="hidden"
                                                                accept="video/*"
                                                                onChange={handleVideoChange}
                                                            />
                                                        </div>
                                                        {videoPreview && (
                                                            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video mt-4">
                                                                <video src={videoPreview} controls className="w-full h-full object-contain" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => { setVideoFile(null); setVideoPreview(null); }}
                                                                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-destructive shadow-xl z-20"
                                                                >
                                                                    <X className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-4">
                                                        <Label htmlFor="description" className="text-base font-bold text-slate-800">Property Description</Label>
                                                        <Textarea
                                                            id="description"
                                                            name="description"
                                                            value={formData.description}
                                                            onChange={handleInputChange}
                                                            placeholder="Describe your project's unique vibe..."
                                                            className="min-h-[200px] rounded-[1.5rem] border-slate-100 shadow-sm focus:border-primary transition-all p-6"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 4 && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                                            <div className="flex items-center gap-3 mb-8">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-heading font-bold text-slate-900">Room Types & Pricing</h2>
                                                    <p className="text-sm text-slate-500 font-medium">Define your inventory and monthly rates</p>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                {roomTypes.map((room) => (
                                                    <div key={room.id} className="p-8 border border-slate-100 rounded-[2rem] space-y-8 bg-slate-50/30">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="text-xl font-bold text-slate-900">{room.name}</h3>
                                                            <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                                                                CATEGORY 0{room.id}
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                            {/* Regular Section */}
                                                            <div className="space-y-6 p-6 md:p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                                            <Building2 className="w-4 h-4" />
                                                                        </div>
                                                                        <Label className="font-bold text-sm text-slate-700">Regular / Non-AC</Label>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Checkbox
                                                                            id={`reg-avail-${room.id}`}
                                                                            checked={room.regularAvailable}
                                                                            onCheckedChange={(val) => handleRoomChange(room.id, 'regularAvailable', val)}
                                                                            className="rounded-md"
                                                                        />
                                                                        <Label htmlFor={`reg-avail-${room.id}`} className="text-xs font-bold text-slate-500 cursor-pointer uppercase tracking-tighter">Listed</Label>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <Label className="text-xs font-bold text-slate-400">Monthly Price</Label>
                                                                        <div className="relative">
                                                                            <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">₹</span>
                                                                            <Input
                                                                                placeholder="0.00"
                                                                                value={room.regularPrice}
                                                                                onChange={(e) => handleRoomChange(room.id, 'regularPrice', e.target.value)}
                                                                                className="pl-7 h-11 rounded-xl border-slate-100"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label className="text-xs font-bold text-slate-400">Total Beds</Label>
                                                                        <Input
                                                                            placeholder="e.g. 20"
                                                                            value={room.regularBeds}
                                                                            onChange={(e) => handleRoomChange(room.id, 'regularBeds', e.target.value)}
                                                                            className="h-11 rounded-xl border-slate-100"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* AC Section */}
                                                            <div className="space-y-6 p-6 md:p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                                            <Wind className="w-4 h-4" />
                                                                        </div>
                                                                        <Label className="font-bold text-sm text-slate-700">AC Premium</Label>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Checkbox
                                                                            id={`ac-avail-${room.id}`}
                                                                            checked={room.acAvailable}
                                                                            onCheckedChange={(val) => handleRoomChange(room.id, 'acAvailable', val)}
                                                                            className="rounded-md"
                                                                        />
                                                                        <Label htmlFor={`ac-avail-${room.id}`} className="text-xs font-bold text-slate-500 cursor-pointer uppercase tracking-tighter">Listed</Label>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <Label className="text-xs font-bold text-slate-400">Monthly Price</Label>
                                                                        <div className="relative">
                                                                            <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">₹</span>
                                                                            <Input
                                                                                placeholder="0.00"
                                                                                value={room.acPrice}
                                                                                onChange={(e) => handleRoomChange(room.id, 'acPrice', e.target.value)}
                                                                                className="pl-7 h-11 rounded-xl border-slate-100"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label className="text-xs font-bold text-slate-400">Total Beds</Label>
                                                                        <Input
                                                                            placeholder="e.g. 10"
                                                                            value={room.acBeds}
                                                                            onChange={(e) => handleRoomChange(room.id, 'acBeds', e.target.value)}
                                                                            className="h-11 rounded-xl border-slate-100"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                            </AnimatePresence>

                            {/* Navigation Buttons */}
                            <div className="pt-10 flex items-center justify-between border-t border-slate-200">
                                {currentStep > 1 ? (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCurrentStep(prev => prev - 1)}
                                        className="h-14 px-8 rounded-2xl font-bold border-slate-200 hover:bg-slate-50 transition-all text-slate-700 gap-2"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                        Back
                                    </Button>
                                ) : <div />}

                                {currentStep < steps.length ? (
                                    <Button
                                        type="button"
                                        onClick={() => setCurrentStep(prev => prev + 1)}
                                        className="h-14 px-10 rounded-2xl font-bold bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-900/10 transition-all gap-2"
                                    >
                                        Next Step
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={submitting}
                                        className="h-14 px-10 rounded-2xl font-bold bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Listing...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-5 h-5" />
                                                Publish Listing
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProperty;
