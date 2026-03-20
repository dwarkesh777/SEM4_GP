import React, { useRef, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CameraModal = ({ onClose, onCaptureComplete }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();

    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            toast({
                title: "Camera Error",
                description: "Unable to access the camera. Please allow camera permissions.",
                variant: "destructive",
            });
            onClose();
        }
    }, [onClose, toast]);

    // Start camera when component mounts
    React.useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, [startCamera]);

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setCapturedImage(dataUrl);
        }
    };

    const retakePhoto = () => {
        setCapturedImage(null);
    };

    const uploadToCloudinary = async () => {
        if (!capturedImage) return;

        setIsUploading(true);
        try {
            // Cloudinary configuration from .env
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

            if (!cloudName || !uploadPreset) {
                throw new Error("Cloudinary configuration missing in environment variables.");
            }

            // Convert base64 to Blob
            const res = await fetch(capturedImage);
            const blob = await res.blob();

            const formData = new FormData();
            formData.append('file', blob);
            formData.append('upload_preset', uploadPreset);

            const cloudinaryRes = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await cloudinaryRes.json();
            if (data.secure_url) {
                onCaptureComplete(data.secure_url);
                stopCamera();
                onClose();
            } else {
                throw new Error("Failed to get secure URL from Cloudinary.");
            }
        } catch (error) {
            toast({
                title: "Upload Failed",
                description: error.message || "Something went wrong while uploading your photo.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-center">Face Capture Required</h2>

                <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6 flex items-center justify-center">
                    {!capturedImage ? (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img src={capturedImage} alt="Captured face" className="w-full h-full object-cover" />
                    )}

                    <canvas ref={canvasRef} className="hidden" />
                </div>

                <div className="flex flex-col gap-3">
                    {!capturedImage ? (
                        <Button onClick={capturePhoto} className="w-full py-6 text-lg">
                            Capture Photo
                        </Button>
                    ) : (
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={retakePhoto} className="flex-1" disabled={isUploading}>
                                Retake
                            </Button>
                            <Button onClick={uploadToCloudinary} className="flex-1" disabled={isUploading}>
                                {isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    "Confirm & Submit"
                                )}
                            </Button>
                        </div>
                    )}
                    <Button variant="ghost" onClick={() => { stopCamera(); onClose(); }} disabled={isUploading}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CameraModal;
