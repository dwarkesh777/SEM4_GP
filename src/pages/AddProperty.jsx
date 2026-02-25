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
        <div className="min-h-screen pt-24 pb-12 bg-secondary/30">
            <div className="container max-w-5xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-heading font-bold">List a New Property</h1>
                        <p className="text-muted-foreground mt-1 text-sm md:text-base">Experience our professional listing service for property owners.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
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
                                <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Complete address with street, building number, etc." className="min-h-[100px]" required />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Pricing */}
                    <div className="bg-background rounded-2xl p-6 md:p-8 shadow-sm border border-border/50">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <Building2 className="w-5 h-5" />
                            <h2 className="text-xl font-heading font-bold">Pricing</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="price">Starting Price (Monthly)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                                    <Input id="price" name="price" value={formData.price} onChange={handleInputChange} placeholder="Price per month" className="pl-7" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="original_price">Original Price (Monthly) - Optional</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                                    <Input id="original_price" name="original_price" value={formData.original_price} onChange={handleInputChange} placeholder="Leave empty if no discount" className="pl-7" />
                                </div>
                                <p className="text-[11px] text-muted-foreground">Original price before discount (will show strikethrough)</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Room Types */}
                    <div className="bg-background rounded-2xl p-6 md:p-8 shadow-sm border border-border/50">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <Building2 className="w-5 h-5" />
                            <h2 className="text-xl font-heading font-bold">Room Types and Pricing</h2>
                        </div>
                        <div className="space-y-6">
                            {roomTypes.map((room) => (
                                <div key={room.id} className="p-5 border rounded-xl space-y-4">
                                    <h3 className="font-bold text-primary">{room.name}</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Regular Section */}
                                        <div className="space-y-4 p-4 bg-secondary/20 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <Label className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Regular / Non-AC</Label>
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`reg-avail-${room.id}`}
                                                        checked={room.regularAvailable}
                                                        onCheckedChange={(val) => handleRoomChange(room.id, 'regularAvailable', val)}
                                                    />
                                                    <Label htmlFor={`reg-avail-${room.id}`} className="text-[10px] font-medium cursor-pointer">Available</Label>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Room Price</Label>
                                                    <Input
                                                        placeholder="Price per month"
                                                        value={room.regularPrice}
                                                        onChange={(e) => handleRoomChange(room.id, 'regularPrice', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Total Beds</Label>
                                                    <Input
                                                        placeholder="e.g., 50"
                                                        value={room.regularBeds}
                                                        onChange={(e) => handleRoomChange(room.id, 'regularBeds', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* AC Section */}
                                        <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                                            <div className="flex items-center justify-between">
                                                <Label className="font-bold text-xs uppercase tracking-wider text-primary/70">AC Room</Label>
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`ac-avail-${room.id}`}
                                                        checked={room.acAvailable}
                                                        onCheckedChange={(val) => handleRoomChange(room.id, 'acAvailable', val)}
                                                    />
                                                    <Label htmlFor={`ac-avail-${room.id}`} className="text-[10px] font-medium cursor-pointer">Available</Label>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Room Price</Label>
                                                    <Input
                                                        placeholder="Price per month"
                                                        value={room.acPrice}
                                                        onChange={(e) => handleRoomChange(room.id, 'acPrice', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Total Beds</Label>
                                                    <Input
                                                        placeholder="e.g., 50"
                                                        value={room.acBeds}
                                                        onChange={(e) => handleRoomChange(room.id, 'acBeds', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 4: Location Coordinates */}
                    <div className="bg-background rounded-2xl p-6 md:p-8 shadow-sm border border-border/50">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <MapPin className="w-5 h-5" />
                            <h2 className="text-xl font-heading font-bold">Location Coordinates</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="latitude">Latitude</Label>
                                <Input id="latitude" name="latitude" value={formData.latitude} onChange={handleInputChange} placeholder="e.g., 23.0225" />
                                <p className="text-[10px] text-muted-foreground cursor-pointer hover:text-primary transition-colors">Get from Google Maps</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="longitude">Longitude</Label>
                                <Input id="longitude" name="longitude" value={formData.longitude} onChange={handleInputChange} placeholder="e.g., 72.5714" />
                                <p className="text-[10px] text-muted-foreground cursor-pointer hover:text-primary transition-colors">Get from Google Maps</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Contact Information */}
                    <div className="bg-background rounded-2xl p-6 md:p-8 shadow-sm border border-border/50">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <Phone className="w-5 h-5" />
                            <h2 className="text-xl font-heading font-bold">Contact Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Contact Phone</Label>
                                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Contact Email</Label>
                                <Input id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="contact@example.com" type="email" required />
                            </div>
                        </div>
                    </div>

                    {/* Section 6 & 7: Amenities and Appliances */}
                    <div className="bg-background rounded-2xl p-6 md:p-8 shadow-sm border border-border/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <div className="flex items-center gap-2 mb-6 text-primary">
                                    <Check className="w-5 h-5" />
                                    <h2 className="text-xl font-heading font-bold">Amenities</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {amenitiesList.map((item) => (
                                        <div key={item.id} className="flex items-center gap-2">
                                            <Checkbox
                                                id={item.id}
                                                checked={formData.amenities.includes(item.id)}
                                                onCheckedChange={() => handleToggleAmenity(item.id)}
                                            />
                                            <Label htmlFor={item.id} className="text-sm flex items-center gap-2 cursor-pointer">
                                                {item.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-6 text-primary">
                                    <Tv className="w-5 h-5" />
                                    <h2 className="text-xl font-heading font-bold">Appliances</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {appliancesList.map((item) => (
                                        <div key={item.id} className="flex items-center gap-2">
                                            <Checkbox
                                                id={item.id}
                                                checked={formData.appliances.includes(item.id)}
                                                onCheckedChange={() => handleToggleAppliance(item.id)}
                                            />
                                            <Label htmlFor={item.id} className="text-sm cursor-pointer">{item.label}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 8: Media and Description */}
                    <div className="bg-background rounded-2xl p-6 md:p-8 shadow-sm border border-border/50">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <ImageIcon className="w-5 h-5" />
                            <h2 className="text-xl font-heading font-bold">Property Photos</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Main Image Upload */}
                            <div className="space-y-4">
                                <Label>Main Thumbnail Image</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-center"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Upload className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Upload Main Image</p>
                                            <p className="text-xs text-muted-foreground">This will be the first image shown</p>
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
                                        <div className="relative rounded-xl overflow-hidden border aspect-video">
                                            <img src={mainImagePreview} alt="Main Preview" className="w-full h-full object-cover" />
                                            <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">MAIN IMAGE</div>
                                            <button
                                                type="button"
                                                onClick={() => { setMainImage(null); setMainImagePreview(null); }}
                                                className="absolute top-2 right-2 bg-background/80 hover:bg-background p-1.5 rounded-full text-destructive transition-all"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Extra Images Upload */}
                            <div className="space-y-4">
                                <Label>Upload Multiple Photos</Label>
                                <div
                                    onClick={() => extraFilesInputRef.current?.click()}
                                    className="border-2 border-dashed border-border rounded-xl p-6 flex items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all w-full"
                                >
                                    <Plus className="w-5 h-5 text-primary" />
                                    <span className="font-medium">Add More Photos</span>
                                    <input
                                        type="file"
                                        ref={extraFilesInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={handleExtraImagesChange}
                                    />
                                </div>
                                <p className="text-[11px] text-muted-foreground">Select multiple images (JPG, PNG, etc.) to showcase your property.</p>

                                {extraImagePreviews.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                                        {extraImagePreviews.map((preview, index) => (
                                            <div key={index} className="relative rounded-lg overflow-hidden border aspect-square group shadow-sm">
                                                <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExtraImage(index)}
                                                    className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Video Upload */}
                            <div className="space-y-4">
                                <Label>Property Video</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div
                                        onClick={() => videoInputRef.current?.click()}
                                        className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-center"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Video className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Upload Property Video</p>
                                            <p className="text-xs text-muted-foreground">Upload a tour of your property</p>
                                        </div>
                                        <input
                                            type="file"
                                            ref={videoInputRef}
                                            className="hidden"
                                            accept="video/*"
                                            onChange={handleVideoChange}
                                        />
                                    </div>

                                    {videoPreview && (
                                        <div className="relative rounded-xl overflow-hidden border aspect-video bg-black flex items-center justify-center">
                                            <video src={videoPreview} controls className="w-full h-full object-contain" />
                                            <button
                                                type="button"
                                                onClick={() => { setVideoFile(null); setVideoPreview(null); }}
                                                className="absolute top-2 right-2 bg-background/80 hover:bg-background p-1.5 rounded-full text-destructive transition-all z-10"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="main_image_url">Or Main Image URL</Label>
                                <Input id="main_image_url" name="main_image_url" value={formData.main_image_url} onChange={handleInputChange} placeholder="Or paste a main image URL here" />
                                <p className="text-[11px] text-muted-foreground">If you don't upload files, you can provide an image URL instead</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe your property, facilities, rules, etc." className="min-h-[150px]" required />
                            </div>
                        </div>
                    </div>

                    <div className="py-6 flex flex-col items-center gap-4">
                        <Button type="submit" size="lg" className="w-full md:w-auto min-w-[240px] gap-2 h-14 text-base font-bold rounded-2xl shadow-lg hover:shadow-primary/25 transition-all" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Listing Property...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5" />
                                    Add Property
                                </>
                            )}
                        </Button>
                        <p className="text-xs text-muted-foreground">By listing property, you agree to our Terms & Conditions</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProperty;
