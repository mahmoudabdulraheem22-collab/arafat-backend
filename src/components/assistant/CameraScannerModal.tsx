import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  X,
  RotateCw,
  Upload,
  Sparkles,
  Compass,
  Building2,
  FileText,
  Pill,
  Bus,
  Check,
  Zap,
  HelpCircle,
} from 'lucide-react';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptureImage: (imageBase64: string, customPrompt: string) => void;
  languageCode?: string;
}

const PRESET_SCAN_CATEGORIES = [
  {
    id: 'landmark',
    icon: Compass,
    titleAr: 'معالم ومشاعر مكة والمدينة',
    titleEn: 'Holy Landmarks',
    defaultPromptAr: 'تعرف على هذا المعلم المقدّس أو المبنى في مكة/المدينة/المشاعر وزودني بالإرشادات.',
    defaultPromptEn: 'Identify this holy landmark or building and provide guidance.',
  },
  {
    id: 'signboard',
    icon: FileText,
    titleAr: 'قراءة اللوحات والإشارات',
    titleEn: 'Read Signboards',
    defaultPromptAr: 'اقرأ النصوص الموجودة في هذه اللوحة الإرشادية ووضح لي معناها واتجاهها.',
    defaultPromptEn: 'Read the text on this signboard and explain its meaning and direction.',
  },
  {
    id: 'medicine',
    icon: Pill,
    titleAr: 'التعرف على الأدوية والمستلزمات',
    titleEn: 'Identify Medicines',
    defaultPromptAr: 'تعرف على هذا الدواء أو المستلزم الطبي المخصص للحاج ووضح إرشادات السلامة.',
    defaultPromptEn: 'Identify this medicine or medical supply and provide safe usage info.',
  },
  {
    id: 'bus',
    icon: Bus,
    titleAr: 'حافلات ومسارات النقل',
    titleEn: 'Buses & Transport',
    defaultPromptAr: 'تعرف على رقم الحافلة أو مسار النقل المكتوب في الصورة ووجهتي المتوقعة.',
    defaultPromptEn: 'Identify the bus number or route line in this image.',
  },
  {
    id: 'ihram',
    icon: Building2,
    titleAr: 'مقتنيات وأحكام الإحرام',
    titleEn: 'Ihram Accessories',
    defaultPromptAr: 'تعرف على مقتنيات الإحرام في الصورة وبيّن الأحكام الدينية المتعلقة بها.',
    defaultPromptEn: 'Identify these Ihram items and explain religious rulings.',
  },
];

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  onCaptureImage,
  languageCode = 'ar',
}) => {
  const isAr = languageCode === 'ar';
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('landmark');
  const [customQuery, setCustomQuery] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  // Start Camera Stream
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        isAr
          ? 'تعذر الفتح التلقائي للكاميرا. يمكنك إما السماح للصلاحيات أو اختيار صورة من المعرض.'
          : 'Camera access denied. Please grant permission or upload an image file.'
      );
    }
  }, [facingMode, isAr]);

  // Handle camera start/stop on open
  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode, capturedImage]);

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
    setIsCapturing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCapturedImage(event.target.result as string);
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleSubmit = () => {
    if (!capturedImage) return;
    const cat = PRESET_SCAN_CATEGORIES.find((c) => c.id === selectedCategory);
    const defaultText = isAr ? cat?.defaultPromptAr : cat?.defaultPromptEn;
    const finalPrompt = customQuery.trim()
      ? `${customQuery.trim()} (${isAr ? cat?.titleAr : cat?.titleEn})`
      : defaultText || (isAr ? 'حلل هذه الصورة' : 'Analyze image');

    onCaptureImage(capturedImage, finalPrompt);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl bg-[#02130D] border border-[#D4AF37]/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-4 bg-[#03291F] border-b border-[#D4AF37]/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#D4AF37] text-[#02130D]">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-[#D4AF37]">
                  {isAr ? 'الكاميرا والرؤية البصرية الذكية لعرفات' : 'Arafat Smart Vision Scanner'}
                </h3>
                <p className="text-[11px] text-[#F8F3E7]/70">
                  {isAr
                    ? 'التقط صورة للتعرف على المعالم واللوحات والأدوية ومستلزمات الإحرام'
                    : 'Scan landmarks, signboards, medicines & Ihram items around you'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#02130D] text-gray-400 hover:text-white hover:bg-rose-950 border border-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hidden Canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Viewport / Body */}
          <div className="p-4 overflow-y-auto flex-1 space-y-4">
            {/* 1. Camera Live or Captured Image View */}
            <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-inner flex items-center justify-center">
              {capturedImage ? (
                <img src={capturedImage} alt="Captured scan" className="w-full h-full object-contain" />
              ) : cameraError ? (
                <div className="p-6 text-center space-y-3">
                  <Camera className="w-10 h-10 text-rose-400 mx-auto opacity-80" />
                  <p className="text-xs text-rose-200">{cameraError}</p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-[#02130D] font-bold text-xs cursor-pointer shadow-md">
                    <Upload className="w-4 h-4" />
                    <span>{isAr ? 'اختيار صورة من الجهاز' : 'Upload Image File'}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              ) : (
                <>
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

                  {/* Golden Scanning Reticle & HUD Overlay */}
                  <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-[#D4AF37]/50 rounded-2xl m-3 flex flex-col justify-between p-4">
                    <div className="flex justify-between items-start">
                      <div className="w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]" />
                      <div className="w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]" />
                    </div>

                    <div className="text-center bg-[#02130D]/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#D4AF37]/40 text-[11px] text-[#D4AF37] font-bold self-center shadow-lg flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>{isAr ? 'وجّه الكاميرا نحو العنصر أو المعلم' : 'Point camera at landmark or item'}</span>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]" />
                      <div className="w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Camera Controls Bar */}
            <div className="flex items-center justify-between gap-2">
              {capturedImage ? (
                <>
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#03291F] border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-xs hover:bg-[#073D2F] transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>{isAr ? 'إعادة الالتقاط' : 'Retake Photo'}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={toggleFacingMode}
                    className="p-3 rounded-xl bg-[#03291F] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#073D2F] transition-all cursor-pointer"
                    title={isAr ? 'تبديل الكاميرا (أمامية / خلفية)' : 'Switch Camera'}
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleCapture}
                    disabled={isCapturing || !!cameraError}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#F5E5BE] text-[#02130D] font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-40"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{isAr ? 'التقاط الصورة وتحليلها' : 'Capture & Analyze Photo'}</span>
                  </button>

                  <label
                    className="p-3 rounded-xl bg-[#03291F] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#073D2F] transition-all cursor-pointer"
                    title={isAr ? 'رفع صورة من المعرض' : 'Upload Image'}
                  >
                    <Upload className="w-4 h-4" />
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </>
              )}
            </div>

            {/* 2. Preset Scan Categories */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>{isAr ? 'اختر نوع الفحص المطلوب:' : 'Select Scan Target Type:'}</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_SCAN_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-2.5 rounded-xl border text-right text-xs transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#D4AF37] text-[#02130D] border-[#D4AF37] font-black shadow-md'
                          : 'bg-[#03291F] text-[#F8F3E7] border-[#D4AF37]/30 hover:border-[#D4AF37]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#02130D]' : 'text-[#D4AF37]'}`} />
                      <span className="truncate">{isAr ? cat.titleAr : cat.titleEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Optional Question / Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#F8F3E7]/80 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{isAr ? 'سؤال إضافي حول الصورة (اختياري):' : 'Additional question (optional):'}</span>
              </label>
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder={
                  isAr
                    ? 'مثال: ما اسم هذا الباب؟ أو هل هذا الدواء آمن لحالتي؟'
                    : 'e.g. What is the name of this gate?'
                }
                className="w-full bg-[#01140E] border border-[#D4AF37]/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="p-4 bg-[#03291F] border-t border-[#D4AF37]/30 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#01140E] text-gray-400 hover:text-white border border-white/10 text-xs font-bold transition-all"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!capturedImage}
              className="flex-1 py-2.5 px-5 rounded-xl bg-[#D4AF37] hover:bg-[#F5E5BE] text-[#02130D] font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isAr ? 'إرسال لعرفات والبدء بالتعرف البصري' : 'Send Image to Arafat AI'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CameraScannerModal;
