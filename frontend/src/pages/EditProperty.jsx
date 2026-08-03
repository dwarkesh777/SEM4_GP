import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";
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

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        type: "Hostel",
        city: "Ahmedabad",
        location: "",
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
        rooms: [{ name: "Standard Room", beds: 1, total_beds: 20, occupancy: "Single", price: "", is_ac: "Non-AC", available: true }]
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

    const getImageUrl = (item) => {
        if (!item) return "";
        let url = typeof item === 'object' ? (item.image || item.url || item.photo || "") : item;
        if (typeof url !== 'string' || !url) return "";
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
            return url;
        }
        return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    useEffect(() => {
        fetchProperty();
    }, [id]);

    const fetchProperty = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            
            const response = await fetch(`${API_URL}/api/properties/${id}/`, {
                headers
            });
            if (!response.ok) throw new Error('Failed to fetch property');
            const data = await response.json();
            
            setFormData({
                name: data.name || "",
                type: data.type || "Hostel",
                city: data.city || "Ahmedabad",
                location: data.location || "",
                gender: data.gender || "Boys",
                address: data.address || "",
                latitude: data.latitude || "",
                longitude: data.longitude || "",
                phone: data.phone || "",
                email: data.email || user?.email || "",
                price: data.price || "",
                originalPrice: data.originalPrice || "",
                description: data.description || "",
                amenities: data.amenities || [],
                appliances: data.appliances || [],
                rooms: data.rooms || [{ name: "Standard Room", beds: 1, total_beds: 20, occupancy: "Single", price: "", is_ac: "Non-AC", available: true }]
            });
            
            setMainImagePreview(data.main_image || null);
            setExtraImagesPreviews(data.images || []);
            setVideoPreview(data.video || null);
        } catch (error) {
            toast.error("Failed to load property data");
            console.error("Error fetching property:", error);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleMainImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImage(file);
            setMainImagePreview(URL.createObjectURL(file));
        }
    };

    const handleExtraImagesUpload = (e) => {
        const files = Array.from(e.target.files);
        setExtraImages(prev => [...prev, ...files]);
        const previews = files.map(file => URL.createObjectURL(file));
        setExtraImagesPreviews(prev => [...prev, ...previews]);
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideo(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const removeExtraImage = (index) => {
        setExtraImages(prev => prev.filter((_, i) => i !== index));
        setExtraImagesPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const toggleAmenity = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const toggleAppliance = (appliance) => {
        setFormData(prev => ({
            ...prev,
            appliances: prev.appliances.includes(appliance)
                ? prev.appliances.filter(a => a !== appliance)
                : [...prev.appliances, appliance]
        }));
    };

    const addRoom = () => {
        setFormData(prev => ({
            ...prev,
            rooms: [...prev.rooms, { name: "", beds: 1, total_beds: 20, occupancy: "Single", price: "", is_ac: "Non-AC", available: true }]
        }));
    };

    const updateRoom = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            rooms: prev.rooms.map((room, i) => i === index ? { ...room, [field]: value } : room)
        }));
    };

    const removeRoom = (index) => {
        setFormData(prev => ({
            ...prev,
            rooms: prev.rooms.filter((_, i) => i !== index)
        }));
    };

    const nextStep = () => {
        if (currentStep < 5) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        // Validate required fields
        if (!formData.name?.trim()) {
            toast.error("Property Name is required in Step 1.");
            setCurrentStep(1);
            return;
        }
        if (!formData.city?.trim()) {
            toast.error("City is required in Step 1.");
            setCurrentStep(1);
            return;
        }
        if (!formData.location?.trim()) {
            toast.error("Location/Area is required in Step 1.");
            setCurrentStep(1);
            return;
        }
        if (!formData.address?.trim()) {
            toast.error("Full Address is required in Step 1.");
            setCurrentStep(1);
            return;
        }
        if (!formData.phone?.trim()) {
            toast.error("Contact Phone is required in Step 1.");
            setCurrentStep(1);
            return;
        }
        if (!formData.price || isNaN(parseInt(formData.price))) {
            toast.error("Starting Monthly Price is required in Step 2.");
            setCurrentStep(2);
            return;
        }

        setLoading(true);
        try {
            const submitData = new FormData();

            // Debug: Log current form data
            console.log("Current form data:", formData);

            // Simple approach: Send all fields directly like a regular form
            submitData.append('name', formData.name || '');
            submitData.append('type', formData.type || '');
            submitData.append('city', formData.city || '');
            submitData.append('location', formData.location || '');
            submitData.append('gender', formData.gender || '');
            submitData.append('address', formData.address || '');
            submitData.append('latitude', formData.latitude || '');
            submitData.append('longitude', formData.longitude || '');
            submitData.append('phone', formData.phone || '');
            submitData.append('email', formData.email || '');
            submitData.append('price', formData.price || '');
            submitData.append('original_price', formData.originalPrice || ''); // Try snake_case
            submitData.append('description', formData.description || '');

            // Handle Arrays
            if (formData.amenities && formData.amenities.length > 0) {
                formData.amenities.forEach(a => submitData.append('amenities', a));
                console.log("Added amenities:", formData.amenities);
            }
            if (formData.appliances && formData.appliances.length > 0) {
                formData.appliances.forEach(a => submitData.append('appliances', a));
                console.log("Added appliances:", formData.appliances);
            }

            // Rooms as JSON string
            if (formData.rooms && formData.rooms.length > 0) {
                submitData.append('rooms_json', JSON.stringify(formData.rooms));
                console.log("Added rooms:", formData.rooms);
            }

            // Images & Video
            if (mainImage) {
                submitData.append('main_image', mainImage);
                console.log("Added main image file:", mainImage);
            }
            if (video) {
                submitData.append('video', video);
                console.log("Added video file:", video);
            }
            if (extraImages && extraImages.length > 0) {
                extraImages.forEach(img => submitData.append('uploaded_images', img));
                console.log("Added extra images:", extraImages);
            }

            // Debug: Log FormData contents
            console.log("FormData contents:");
            for (let [key, value] of submitData.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await fetch(`${API_URL}/api/properties/${id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                    // Don't set Content-Type, browser does it for FormData
                },
                body: submitData
            });

            console.log("Response status:", response.status);
            console.log("Response ok:", response.ok);

            if (response.ok) {
                const responseData = await response.json();
                console.log("Updated property data:", responseData);
                toast.success("Property updated successfully!");
                navigate('/dashboard');
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error("Error response data:", errorData);
                // DRF returns errors as { field: ["msg"] } or { error: "msg" } or { detail: "msg" }
                let errorMsg = "Update failed.";
                if (errorData.error) {
                    errorMsg = errorData.error;
                } else if (errorData.detail) {
                    errorMsg = errorData.detail;
                } else if (typeof errorData === 'object') {
                    // Flatten field-level errors: { name: ["required"], price: ["invalid"] }
                    const fieldErrors = Object.entries(errorData)
                        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`)
                        .join(" | ");
                    errorMsg = fieldErrors || errorMsg;
                }
                console.error("Property update error:", errorData);
                toast.error(errorMsg);
            }
        } catch (error) {
            console.error("Submission failed:", error);
            toast.error(`Error: ${error.message || "Something went wrong"}. Check if backend is running at ${API_URL}`);
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Building2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-lg font-medium text-slate-600">Loading property data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/dashboard')}
                        className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Button>
                    <h1 className="text-3xl font-black text-slate-900">Edit Property</h1>
                    <div className="w-20" />
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-12">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div className={`flex flex-col items-center ${currentStep >= step.id ? 'text-blue-600' : 'text-slate-400'}`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                                    currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-slate-200'
                                }`}>
                                    <step.icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold mt-2">{step.subtitle}</span>
                                <span className="text-sm font-bold">{step.title}</span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-1 mx-4 ${currentStep > step.id ? 'bg-blue-600' : 'bg-slate-200'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <h2 className="text-2xl font-bold text-slate-900">Basic Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Property Name</Label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Enter property name"
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Property Type</Label>
                                        <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                                            <SelectTrigger className="h-12">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Hostel">Hostel</SelectItem>
                                                <SelectItem value="PG">PG</SelectItem>
                                                <SelectItem value="Flat">Flat</SelectItem>
                                                <SelectItem value="House">House</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>City</Label>
                                        <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                                            <SelectTrigger className="h-12">
                                                <SelectValue placeholder="Select city" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                                                <SelectItem value="Mumbai">Mumbai</SelectItem>
                                                <SelectItem value="Delhi">Delhi</SelectItem>
                                                <SelectItem value="Bangalore">Bangalore</SelectItem>
                                                <SelectItem value="Pune">Pune</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Location/Area</Label>
                                        <Input
                                            value={formData.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            placeholder="Enter area/location"
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Gender</Label>
                                        <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                                            <SelectTrigger className="h-12">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Boys">Boys</SelectItem>
                                                <SelectItem value="Girls">Girls</SelectItem>
                                                <SelectItem value="Co-ed">Co-ed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone Number</Label>
                                        <Input
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            placeholder="Enter phone number"
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="col-span-full space-y-2">
                                        <Label>Full Address</Label>
                                        <Textarea
                                            value={formData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            placeholder="Enter complete address"
                                            className="min-h-[120px]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Latitude</Label>
                                        <Input
                                            value={formData.latitude}
                                            onChange={(e) => handleInputChange('latitude', e.target.value)}
                                            placeholder="Enter latitude"
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Longitude</Label>
                                        <Input
                                            value={formData.longitude}
                                            onChange={(e) => handleInputChange('longitude', e.target.value)}
                                            placeholder="Enter longitude"
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="col-span-full space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            placeholder="Describe your property"
                                            className="min-h-[120px]"
                                        />
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
                                <h2 className="text-2xl font-bold text-slate-900">Pricing Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Monthly Rent (₹)</Label>
                                        <Input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => handleInputChange('price', e.target.value)}
                                            placeholder="Enter monthly rent"
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Original Price (₹)</Label>
                                        <Input
                                            type="number"
                                            value={formData.originalPrice}
                                            onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                                            placeholder="Enter original price"
                                            className="h-12"
                                        />
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
                                <h2 className="text-2xl font-bold text-slate-900">Amenities</h2>
                                
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-700 mb-4">Basic Amenities</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {AMENITIES_LIST.map((amenity) => (
                                                <Button
                                                    key={amenity}
                                                    type="button"
                                                    variant={formData.amenities.includes(amenity) ? "default" : "outline"}
                                                    onClick={() => toggleAmenity(amenity)}
                                                    className={`h-auto p-4 flex flex-col gap-2 ${
                                                        formData.amenities.includes(amenity) 
                                                            ? 'bg-blue-600 text-white border-blue-600' 
                                                            : 'border-slate-200 hover:border-blue-300'
                                                    }`}
                                                >
                                                    <CheckCircle2 className="w-6 h-6" />
                                                    <span className="text-sm font-bold capitalize">
                                                        {amenity.replace('_', ' ')}
                                                    </span>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-700 mb-4">Appliances</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {APPLIANCES_LIST.map((appliance) => (
                                                <Button
                                                    key={appliance}
                                                    type="button"
                                                    variant={formData.appliances.includes(appliance) ? "default" : "outline"}
                                                    onClick={() => toggleAppliance(appliance)}
                                                    className={`h-auto p-4 flex flex-col gap-2 ${
                                                        formData.appliances.includes(appliance) 
                                                            ? 'bg-blue-600 text-white border-blue-600' 
                                                            : 'border-slate-200 hover:border-blue-300'
                                                    }`}
                                                >
                                                    <CheckCircle2 className="w-6 h-6" />
                                                    <span className="text-sm font-bold capitalize">
                                                        {appliance.replace('_', ' ')}
                                                    </span>
                                                </Button>
                                            ))}
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
                                <h2 className="text-2xl font-bold text-slate-900">Property Media</h2>
                                
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <Label>Main Image</Label>
                                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
                                            {mainImagePreview ? (
                                                <div className="space-y-4">
                                                    <img src={getImageUrl(mainImagePreview)} alt="Main" className="w-32 h-32 object-cover rounded-lg mx-auto" />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        Change Image
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <Upload className="w-12 h-12 text-slate-400 mx-auto" />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        Upload Main Image
                                                    </Button>
                                                </div>
                                            )}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleMainImageUpload}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label>Additional Images</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {extraImagesPreviews.map((preview, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={getImageUrl(preview)}
                                                        alt={`Property ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-xl"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="absolute top-2 right-2 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => removeExtraImage(index)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-32 border-2 border-dashed border-slate-300 hover:border-blue-400"
                                                onClick={() => extraFilesInputRef.current?.click()}
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <Upload className="w-6 h-6 text-slate-400" />
                                                    <span className="text-sm font-medium text-slate-600">Add Image</span>
                                                </div>
                                            </Button>
                                        </div>
                                        <input
                                            ref={extraFilesInputRef}
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleExtraImagesUpload}
                                            className="hidden"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label>Property Video (Optional)</Label>
                                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
                                            {videoPreview ? (
                                                <div className="space-y-4">
                                                    <video src={getImageUrl(videoPreview)} className="w-32 h-32 rounded-lg mx-auto" controls />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => videoInputRef.current?.click()}
                                                    >
                                                        Change Video
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <Video className="w-12 h-12 text-slate-400 mx-auto" />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => videoInputRef.current?.click()}
                                                    >
                                                        Upload Video
                                                    </Button>
                                                </div>
                                            )}
                                            <input
                                                ref={videoInputRef}
                                                type="file"
                                                accept="video/*"
                                                onChange={handleVideoUpload}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <h2 className="text-2xl font-bold text-slate-900">Room Information</h2>
                                
                                <div className="space-y-6">
                                    {formData.rooms.map((room, index) => (
                                        <div key={index} className="border border-slate-200 rounded-xl p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-lg">Room {index + 1}</h3>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => removeRoom(index)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Room Name</Label>
                                                    <Input
                                                        value={room.name}
                                                        onChange={(e) => updateRoom(index, 'name', e.target.value)}
                                                        placeholder="Enter room name"
                                                        className="h-12"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Beds/Room</Label>
                                                    <Input
                                                        type="number"
                                                        value={room.beds}
                                                        onChange={(e) => updateRoom(index, 'beds', parseInt(e.target.value))}
                                                        placeholder="Beds per room unit"
                                                        className="h-12"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Total Beds</Label>
                                                    <Input
                                                        type="number"
                                                        value={room.total_beds ?? 20}
                                                        onChange={(e) => updateRoom(index, 'total_beds', parseInt(e.target.value) || 1)}
                                                        placeholder="Total bed capacity"
                                                        min={1}
                                                        className="h-12"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Occupancy</Label>
                                                    <Select
                                                        value={room.occupancy}
                                                        onValueChange={(value) => updateRoom(index, 'occupancy', value)}
                                                    >
                                                        <SelectTrigger className="h-12">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Single">Single</SelectItem>
                                                            <SelectItem value="Double">Double</SelectItem>
                                                            <SelectItem value="Triple">Triple</SelectItem>
                                                            <SelectItem value="Four">Four</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Price per Bed (₹)</Label>
                                                    <Input
                                                        type="number"
                                                        value={room.price}
                                                        onChange={(e) => updateRoom(index, 'price', e.target.value)}
                                                        placeholder="Price per bed"
                                                        className="h-12"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>AC/Non-AC</Label>
                                                    <Select
                                                        value={room.is_ac}
                                                        onValueChange={(value) => updateRoom(index, 'is_ac', value)}
                                                    >
                                                        <SelectTrigger className="h-12">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="AC">AC</SelectItem>
                                                            <SelectItem value="Non-AC">Non-AC</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Available</Label>
                                                    <Select
                                                        value={room.available.toString()}
                                                        onValueChange={(value) => updateRoom(index, 'available', value === 'true')}
                                                    >
                                                        <SelectTrigger className="h-12">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="true">Available</SelectItem>
                                                            <SelectItem value="false">Not Available</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addRoom}
                                        className="w-full h-12 border-2 border-dashed border-slate-300 hover:border-blue-400"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Add Room
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-200">
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </Button>
                        
                        {currentStep === 5 ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                            >
                                {loading ? "Updating..." : "Update Property"}
                            </Button>
                        ) : (
                            <Button
                                onClick={nextStep}
                                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProperty;
