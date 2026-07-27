import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Navigation,
  MapPin,
  Compass,
  ArrowRight,
  LocateFixed,
  Share2,
  HeartPulse,
  Users,
  Droplets,
  Bus,
  Utensils,
  Search,
  Filter,
  Phone,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ExternalLink,
  ShieldAlert,
  Info,
  CheckCircle2,
  Clock,
  Map,
  List,
} from 'lucide-react';
import { LanguageOption } from '../../data/languages';

interface MyLocationViewProps {
  language: LanguageOption;
  onBack: () => void;
  onSendToWhatsapp: (message: string) => void;
}

export interface Facility {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'clinic' | 'assembly' | 'water' | 'transit' | 'food' | 'restroom';
  area: 'arafat' | 'mina' | 'haram' | 'muzdalifah';
  distance: string;
  walkTime: string;
  phone: string;
  statusAr: string;
  statusEn: string;
  coords: string;
  x: number; // percentage on map canvas (10-90)
  y: number; // percentage on map canvas (10-90)
  descAr: string;
  descEn: string;
}

export const MyLocationView: React.FC<MyLocationViewProps> = ({
  language,
  onBack,
  onSendToWhatsapp,
}) => {
  const isAr = language.code === 'ar';

  const [activeArea, setActiveArea] = useState<'arafat' | 'mina' | 'haram'>('arafat');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Main Destination Points
  const destinations = [
    {
      id: 'arafat',
      nameAr: 'صعيد عرفات (جبل الرحمة ومسجد نمرة)',
      nameEn: 'Arafat Plains (Mount Rahmah & Namirah)',
      distanceKm: '0.2 كم',
      walkMin: '3 دقائق مشياً',
      mapCoords: '21.3549,39.9841',
    },
    {
      id: 'mina',
      nameAr: 'مخيمات منى وجسر الجمرات',
      nameEn: 'Mina Camps & Jamarat',
      distanceKm: '8.5 كم',
      walkMin: '15 دقيقة بالقطار',
      mapCoords: '21.4133,39.8933',
    },
    {
      id: 'haram',
      nameAr: 'المسجد الحرام والكعبة المشرفة',
      nameEn: 'Al-Masjid Al-Haram & Kaaba',
      distanceKm: '21.5 كم',
      walkMin: '25 دقيقة بالحافلة',
      mapCoords: '21.4225,39.8262',
    },
  ];

  // Service Facilities Database
  const facilitiesData: Facility[] = [
    // ARAFAT FACILITIES
    {
      id: 'f-arafat-clinic-1',
      nameAr: 'مستشفى جبل الرحمة العام بعرفات',
      nameEn: 'Jabal Al Rahmah General Hospital',
      category: 'clinic',
      area: 'arafat',
      distance: '180 متر',
      walkTime: 'دقيقتان مشياً',
      phone: '937',
      statusAr: 'مفتوح 24 ساعة - كادر طبي متكامل وطوارئ',
      statusEn: 'Open 24/7 - Full Medical Team & ER',
      coords: '21.3552,39.9845',
      x: 35,
      y: 40,
      descAr: 'مركز طبي مجهز بأحدث أجهزة الإنعاش والعناية المركزة وعلاج ضربات الشمس مجاناً.',
      descEn: 'Medical center equipped with ICU units and heat stroke prevention for pilgrims.',
    },
    {
      id: 'f-arafat-assembly-1',
      nameAr: 'نقطة تجمع وإرشاد حجاج الحملة 104',
      nameEn: 'Group Assembly & Guidance Point 104',
      category: 'assembly',
      area: 'arafat',
      distance: '90 متر',
      walkTime: 'دقيقة واحدة مشياً',
      phone: '1966',
      statusAr: 'متواجد به المشرفون والرايات التوجيهية',
      statusEn: 'Supervisors & Flags Available',
      coords: '21.3540,39.9830',
      x: 52,
      y: 28,
      descAr: 'نقطة التقاء رئيسية لحجاج الحملة مع توفر خيمة استراحة ومكتب إرشاد التائهين.',
      descEn: 'Main meeting hub for group pilgrims with guidance office for lost pilgrims.',
    },
    {
      id: 'f-arafat-water-1',
      nameAr: 'محطة سقيا زمزم وتوزيع المياه الباردة',
      nameEn: 'Zamzam & Cold Water Distribution',
      category: 'water',
      area: 'arafat',
      distance: '120 متر',
      walkTime: 'دقيقتان مشياً',
      phone: '911',
      statusAr: 'متوفر مياه معقمة ومبردة مجاناً',
      statusEn: 'Free Chilled Sterilized Water Available',
      coords: '21.3545,39.9850',
      x: 68,
      y: 48,
      descAr: 'نقاط توزيع مظلات شمسية وزجاجات مياه زمزم الباردة لحماية الحجاج من الحرارة.',
      descEn: 'Free umbrellas and chilled Zamzam water bottles distribution point.',
    },
    {
      id: 'f-arafat-transit-1',
      nameAr: 'محطة قطار المشاعر - عرفات 3',
      nameEn: 'Al Mashaaer Train Station - Arafat 3',
      category: 'transit',
      area: 'arafat',
      distance: '400 متر',
      walkTime: '5 دقائق مشياً',
      phone: '920000329',
      statusAr: 'جاهز للنفرة إلى مزدلفة بعد المغرب',
      statusEn: 'Ready for Nafrah to Muzdalifah',
      coords: '21.3580,39.9890',
      x: 82,
      y: 20,
      descAr: 'محطة القطار المباشرة المتجهة نحو مزدلفة ومنى بسرعة وانسيابية عالية.',
      descEn: 'Direct train station connecting Arafat to Muzdalifah and Mina.',
    },
    {
      id: 'f-arafat-food-1',
      nameAr: 'مركز توزيع وجبات الإطعام الخيري',
      nameEn: 'Charitable Meals Distribution Center',
      category: 'food',
      area: 'arafat',
      distance: '250 متر',
      walkTime: '3 دقائق مشياً',
      phone: '1966',
      statusAr: 'توزيع وجبات جافة وجبات ساخنة طازجة',
      statusEn: 'Fresh Hot Meals & Snack Boxes',
      coords: '21.3530,39.9820',
      x: 25,
      y: 65,
      descAr: 'وجبات غذائية متكاملة ومظلات ومرطبات موزعة برعاية الهيئات الخيرية الملكية.',
      descEn: 'Nutritious meal packs and refreshments provided free for all pilgrims.',
    },
    {
      id: 'f-arafat-restroom-1',
      nameAr: 'مجمع دورات المياه والمواضئ رقم 18',
      nameEn: 'Restroom & Ablution Complex #18',
      category: 'restroom',
      area: 'arafat',
      distance: '150 متر',
      walkTime: 'دقيقتان مشياً',
      phone: '911',
      statusAr: 'متاح 24 ساعة - نظافة وتعقيم مستمر',
      statusEn: 'Open 24/7 - Continuous Sanitization',
      coords: '21.3560,39.9860',
      x: 45,
      y: 75,
      descAr: 'مجمع مجهز بدورات مياه ومواضئ حديثة ومرافق خاصة لكبار السن وذوي الإعاقة.',
      descEn: 'Modern ablution facilities with dedicated accessible units for seniors.',
    },

    // MINA FACILITIES
    {
      id: 'f-mina-clinic-1',
      nameAr: 'مستشفى منى الطوارئ بالجمرات',
      nameEn: 'Mina Emergency Hospital Jamarat',
      category: 'clinic',
      area: 'mina',
      distance: '300 متر',
      walkTime: '4 دقائق مشياً',
      phone: '937',
      statusAr: 'طوارئ وعناية حادة متكاملة',
      statusEn: 'Full Emergency & ICU Facility',
      coords: '21.4140,39.8940',
      x: 40,
      y: 35,
      descAr: 'مستشفى طوارئ متخصص بالقرب من جسر الجمرات لتوفير الرعاية السريعة.',
      descEn: 'Specialized emergency hospital located right near the Jamarat bridge.',
    },
    {
      id: 'f-mina-assembly-1',
      nameAr: 'مركز إرشاد التائهين والتجمع رقم 42',
      nameEn: 'Lost Pilgrims Guidance Center #42',
      category: 'assembly',
      area: 'mina',
      distance: '200 متر',
      walkTime: 'دقيقتان مشياً',
      phone: '1966',
      statusAr: 'مترجمون بـ 15 لغة متواجدون',
      statusEn: 'Translators in 15 Languages On-Duty',
      coords: '21.4120,39.8920',
      x: 60,
      y: 50,
      descAr: 'مركز دعم وإرشاد بجميع اللغات العالمية لمساعدة الحجاج والوصول لمخيماتهم.',
      descEn: 'Guidance center providing multilingual support to locate pilgrim tents.',
    },
    {
      id: 'f-mina-transit-1',
      nameAr: 'محطة حافلات الترددية بمنى',
      nameEn: 'Mina Shuttle Bus Terminal',
      category: 'transit',
      area: 'mina',
      distance: '350 متر',
      walkTime: '4 دقائق مشياً',
      phone: '920000329',
      statusAr: 'حافلات ترددي مكيفة مستمرة',
      statusEn: 'Continuous Air-conditioned Shuttles',
      coords: '21.4150,39.8960',
      x: 75,
      y: 30,
      descAr: 'نقل ترددي سريع ومستمر يربط بين مخيمات منى والمسجد الحرام.',
      descEn: 'Frequent shuttle bus transport directly linking Mina camps to Haram.',
    },

    // HARAM FACILITIES
    {
      id: 'f-haram-clinic-1',
      nameAr: 'مركز العيادات الطبية بالباب رقم 89 (الملك فهد)',
      nameEn: 'King Fahd Gate Medical Center (Gate 89)',
      category: 'clinic',
      area: 'haram',
      distance: '100 متر',
      walkTime: 'دقيقة واحدة',
      phone: '937',
      statusAr: 'عيادات مجهزة داخل صحن الحرم',
      statusEn: 'In-Haram Medical Clinic',
      coords: '21.4230,39.8260',
      x: 50,
      y: 45,
      descAr: 'عيادات إسعاف أولية تقدم خدمات معالجة الإجهاد والإغماء ورعاية الحجاج أثناء الطواف.',
      descEn: 'First-aid clinic inside Haram for immediate assistance during Tawaf.',
    },
    {
      id: 'f-haram-water-1',
      nameAr: 'مجمع حافظات زمزم الرئيسي - توسعة الملك عبدالله',
      nameEn: 'Main Zamzam Dispensary - KAA Extension',
      category: 'water',
      area: 'haram',
      distance: '50 متر',
      walkTime: 'مباشر',
      phone: '911',
      statusAr: 'مياه زمزم مباركة مبردة وغير مبردة',
      statusEn: 'Chilled & Non-chilled Pure Zamzam',
      coords: '21.4220,39.8270',
      x: 30,
      y: 60,
      descAr: 'نقاط شرب زمزم معقمة بصفة مستمرة مع توفر كاسات للاستخدام الواحد.',
      descEn: 'Continuously sanitized Zamzam drinking fountains inside the courtyard.',
    },
    {
      id: 'f-haram-assembly-1',
      nameAr: 'نقطة تجمع باب علي وخدمة العربات الكهربائية',
      nameEn: 'Bab Ali Assembly & Electric Wheelchairs',
      category: 'assembly',
      area: 'haram',
      distance: '150 متر',
      walkTime: 'دقيقتان',
      phone: '1966',
      statusAr: 'حجز وتسليم العربات الذكية مجاناً',
      statusEn: 'Electric Wheelchair Reservation Point',
      coords: '21.4240,39.8280',
      x: 70,
      y: 35,
      descAr: 'استلام العربات المخصصة للطواف والسعي لكبار السن والمرضى.',
      descEn: 'Service point for complimentary electric carts for Tawaf and Sa’i.',
    },
  ];

  // Filter Categories Definition
  const categories = [
    { id: 'all', nameAr: 'جميع المرافق', nameEn: 'All Facilities', icon: MapPin, color: 'text-amber-400' },
    { id: 'clinic', nameAr: 'العيادات والطبابة', nameEn: 'Clinics & Hospitals', icon: HeartPulse, color: 'text-red-400' },
    { id: 'assembly', nameAr: 'نقاط التجمع والإرشاد', nameEn: 'Assembly Points', icon: Users, color: 'text-blue-400' },
    { id: 'water', nameAr: 'محطات زمزم للسقيا', nameEn: 'Zamzam & Water', icon: Droplets, color: 'text-cyan-400' },
    { id: 'transit', nameAr: 'الحافلات والقطار', nameEn: 'Transit & Bus', icon: Bus, color: 'text-emerald-400' },
    { id: 'food', nameAr: 'الوجبات والإطعام', nameEn: 'Meals Distribution', icon: Utensils, color: 'text-orange-400' },
    { id: 'restroom', nameAr: 'دورات المياه والمواضئ', nameEn: 'Restrooms', icon: Info, color: 'text-purple-400' },
  ];

  // Filter facilities based on active area, category, and search query
  const filteredFacilities = facilitiesData.filter((item) => {
    const matchesArea = item.area === activeArea;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.descAr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesArea && matchesCategory && matchesSearch;
  });

  const currentDestination = destinations.find((d) => d.id === activeArea)!;

  const handleShareLocation = () => {
    const msg = isAr
      ? `📍 *موقعي المباشر عبر منصة عرفات الرقمية*:\nالمنطقة الحالية: ${currentDestination.nameAr}\nخرائط جوجل للموقع: https://maps.google.com/?q=${currentDestination.mapCoords}\nالمرافق القريبة مني: مستشفيات، سقيا زمزم، ونقاط تجمع الحجاج.`
      : `📍 *My Live Location via Arafat Platform*:\nCurrent Area: ${currentDestination.nameEn}\nGoogle Maps: https://maps.google.com/?q=${currentDestination.mapCoords}`;

    onSendToWhatsapp(msg);
  };

  const getCategoryIcon = (category: Facility['category']) => {
    switch (category) {
      case 'clinic':
        return <HeartPulse className="w-4 h-4 text-red-400" />;
      case 'assembly':
        return <Users className="w-4 h-4 text-blue-400" />;
      case 'water':
        return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'transit':
        return <Bus className="w-4 h-4 text-emerald-400" />;
      case 'food':
        return <Utensils className="w-4 h-4 text-orange-400" />;
      case 'restroom':
        return <Info className="w-4 h-4 text-purple-400" />;
      default:
        return <MapPin className="w-4 h-4 text-[#D4AF37]" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-[#021811]/95 text-[#F8F3E7] rounded-3xl border-2 border-[#D4AF37] shadow-[0_20px_50px_rgba(0,0,0,0.9)] my-6">
      {/* Top Navigation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D4AF37]/30 pb-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/60 bg-[#03291F] hover:bg-[#073D2F] text-[#D4AF37] transition-all text-sm font-bold cursor-pointer"
        >
          <ArrowRight className={`w-4 h-4 ${!isAr ? 'rotate-180' : ''}`} />
          <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#D4AF37]">
              {isAr ? 'خريطة المشاعر والمرافق القريبة' : 'Interactive Map & Nearby Services'}
            </h2>
            <p className="text-xs text-[#F8F3E7]/70">
              {isAr
                ? 'استكشف موقعك وتنقّل بين العيادات الطبية، محطات زمزم، ونقاط تجمع الحجاج'
                : 'Locate clinics, Zamzam stations, and group assembly points around you'}
            </p>
          </div>
        </div>

        <button
          onClick={handleShareLocation}
          className="px-4 py-2 rounded-full bg-[#073D2F] border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <Share2 className="w-4 h-4" />
          <span>{isAr ? 'مشاركة موقعي للأهل' : 'Share Location'}</span>
        </button>
      </div>

      {/* Primary Area Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-[#01140E] p-2.5 rounded-2xl border border-[#D4AF37]/40">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-[#D4AF37] px-2 shrink-0 flex items-center gap-1.5">
            <LocateFixed className="w-4 h-4" />
            <span>{isAr ? 'المنطقة الحالية:' : 'Current Area:'}</span>
          </span>

          {destinations.map((dest) => (
            <button
              key={dest.id}
              onClick={() => {
                setActiveArea(dest.id as any);
                setSelectedFacility(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                activeArea === dest.id
                  ? 'bg-[#D4AF37] text-[#02130D] border-white shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                  : 'bg-[#03291F] text-[#F8F3E7] border-[#D4AF37]/30 hover:border-[#D4AF37]'
              }`}
            >
              {isAr ? dest.nameAr : dest.nameEn}
            </button>
          ))}
        </div>

        {/* View Mode Toggle Button */}
        <div className="flex items-center gap-1 bg-[#021811] p-1 rounded-xl border border-[#D4AF37]/30 shrink-0">
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'map' ? 'bg-[#D4AF37] text-[#02130D]' : 'text-[#F8F3E7]/70 hover:text-white'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>{isAr ? 'الخريطة التفاعلية' : 'Interactive Map'}</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'list' ? 'bg-[#D4AF37] text-[#02130D]' : 'text-[#F8F3E7]/70 hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>{isAr ? 'قائمة المرافق' : 'Facilities List'}</span>
          </button>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute top-3 right-3 text-[#D4AF37]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isAr
                  ? 'بحث عن مرفق طبي، زمزم، نقطة تجمع، أو موقف حافلات...'
                  : 'Search clinic, Zamzam, assembly point, or transit...'
              }
              className="w-full bg-[#01140E] border border-[#D4AF37]/50 rounded-xl pr-9 pl-4 py-2 text-xs sm:text-sm text-white placeholder-[#F8F3E7]/50 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="text-xs text-[#D4AF37] font-bold bg-[#03291F] px-3 py-2 rounded-xl border border-[#D4AF37]/30 flex items-center gap-2 justify-center shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>{isAr ? `نتائج المرافق: (${filteredFacilities.length})` : `Facilities: (${filteredFacilities.length})`}</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-[#D4AF37] text-[#02130D] border-white shadow-md'
                    : 'bg-[#03291F] text-[#F8F3E7]/80 border-[#D4AF37]/20 hover:border-[#D4AF37]/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#02130D]' : cat.color}`} />
                <span>{isAr ? cat.nameAr : cat.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Map & Content View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Main Section: Visual Interactive Map or List */}
        <div className="lg:col-span-8 bg-[#01140E] rounded-3xl border-2 border-[#D4AF37] p-4 relative overflow-hidden flex flex-col justify-between min-h-[420px]">
          {/* Map Top Bar Status */}
          <div className="flex items-center justify-between bg-[#021811]/90 p-3 rounded-2xl border border-[#D4AF37]/30 z-20 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-[#D4AF37]">
                {isAr ? 'نظام الملاحة GPS المباشر متصل' : 'Live GPS Connected'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#F8F3E7]/80 bg-[#03291F] px-2.5 py-1 rounded-lg border border-[#D4AF37]/30">
                {isAr ? currentDestination.nameAr : currentDestination.nameEn}
              </span>

              {/* Map Zoom Controls */}
              {viewMode === 'map' && (
                <div className="flex items-center gap-1 bg-[#02130D] p-1 rounded-lg border border-[#D4AF37]/40">
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.6))}
                    className="p-1 hover:text-[#D4AF37] text-white cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
                    className="p-1 hover:text-[#D4AF37] text-white cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="p-1 hover:text-[#D4AF37] text-white cursor-pointer"
                    title="Reset Zoom"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Map View Canvas or Facilities List */}
          {viewMode === 'map' ? (
            <div className="my-4 relative w-full h-[360px] sm:h-[420px] bg-gradient-to-b from-[#021E15] via-[#021811] to-[#03291F] rounded-2xl border border-[#D4AF37]/30 overflow-hidden flex items-center justify-center">
              {/* Grid Background Pattern */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#D4AF37 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.3s ease',
                }}
              />

              {/* Stylized Holy Area Road & Topography Vector Overlay */}
              <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 50 100 Q 200 150 400 120 T 700 300" stroke="#D4AF37" strokeWidth="4" fill="none" strokeDasharray="6 6" />
                <path d="M 100 350 Q 300 200 650 320" stroke="#D4AF37" strokeWidth="2" fill="none" opacity="0.6" />
                <circle cx="50%" cy="50%" r="140" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.2" />
                <circle cx="50%" cy="50%" r="220" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.1" />
              </svg>

              {/* Center Pilgrim Marker (You Are Here) */}
              <div
                className="absolute z-20 transition-transform duration-300"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) scale(${zoomLevel})`,
                }}
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-400 animate-ping absolute" />
                  <div className="w-9 h-9 rounded-full bg-[#02130D] border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)] z-10">
                    <Navigation className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className="absolute -bottom-6 whitespace-nowrap bg-[#02130D] border border-emerald-400 px-2 py-0.5 rounded-md text-[10px] font-black text-emerald-300 shadow-md">
                    {isAr ? 'موقعك الحالي 📍' : 'Your Location 📍'}
                  </span>
                </div>
              </div>

              {/* Interactive Facility Markers */}
              <div
                className="absolute inset-0 transition-transform duration-300"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                }}
              >
                {filteredFacilities.map((fac) => {
                  const isSelected = selectedFacility?.id === fac.id;
                  return (
                    <motion.button
                      key={fac.id}
                      onClick={() => setSelectedFacility(fac)}
                      whileHover={{ scale: 1.25 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        left: `${fac.x}%`,
                        top: `${fac.y}%`,
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full border-2 transition-all cursor-pointer z-10 ${
                        isSelected
                          ? 'bg-[#D4AF37] text-[#02130D] border-white scale-125 z-30 shadow-[0_0_25px_rgba(212,175,55,1)] ring-4 ring-white/30'
                          : 'bg-[#021811] text-white border-[#D4AF37] hover:border-white shadow-lg'
                      }`}
                      title={isAr ? fac.nameAr : fac.nameEn}
                    >
                      {getCategoryIcon(fac.category)}

                      {/* Tooltip Label */}
                      <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#02130D]/95 border border-[#D4AF37]/60 px-2 py-0.5 rounded text-[10px] font-bold text-[#F8F3E7] shadow-xl pointer-events-none opacity-90">
                        {isAr ? fac.nameAr : fac.nameEn}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Empty Search Feedback */}
              {filteredFacilities.length === 0 && (
                <div className="z-20 text-center p-6 bg-[#02130D]/90 rounded-2xl border border-[#D4AF37]/30 max-w-sm">
                  <Info className="w-8 h-8 text-[#D4AF37] mx-auto mb-2 animate-bounce" />
                  <p className="text-xs text-white font-bold mb-1">
                    {isAr ? 'لم يتم العثور على مرافق مطابقة لجمُلة البحث' : 'No facilities matched your search query'}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="text-[11px] text-[#D4AF37] hover:underline cursor-pointer"
                  >
                    {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* List View mode */
            <div className="my-4 space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {filteredFacilities.map((fac) => (
                <div
                  key={fac.id}
                  onClick={() => setSelectedFacility(fac)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    selectedFacility?.id === fac.id
                      ? 'bg-[#D4AF37] text-[#02130D] border-white font-bold shadow-lg'
                      : 'bg-[#021811] text-[#F8F3E7] border-[#D4AF37]/30 hover:border-[#D4AF37]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#03291F] border border-[#D4AF37]/40">
                      {getCategoryIcon(fac.category)}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black">
                        {isAr ? fac.nameAr : fac.nameEn}
                      </h4>
                      <p className="text-[11px] opacity-80 mt-0.5">
                        {isAr ? fac.statusAr : fac.statusEn}
                      </p>
                    </div>
                  </div>

                  <div className="text-end shrink-0">
                    <span className="text-xs font-black block">{fac.distance}</span>
                    <span className="text-[10px] opacity-80">{fac.walkTime}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Direct Google Maps Action */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <a
              href={`https://maps.google.com/?q=${currentDestination.mapCoords}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#02130D] font-black text-xs flex items-center justify-center gap-2 shadow-lg hover:from-[#E5C158] transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>
                {isAr
                  ? `توجيه ملاحي مباشر نحو ${currentDestination.nameAr}`
                  : `Live Navigation to ${currentDestination.nameEn}`}
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right Section: Selected Facility Details Card & Emergency Contacts */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Facility Details Card */}
          <AnimatePresence mode="wait">
            {selectedFacility ? (
              <motion.div
                key={selectedFacility.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-[#03291F] border-2 border-[#D4AF37] rounded-3xl p-4 sm:p-5 shadow-2xl relative"
              >
                <div className="flex items-start justify-between gap-2 border-b border-[#D4AF37]/30 pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-[#02130D] border border-[#D4AF37]">
                      {getCategoryIcon(selectedFacility.category)}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[#D4AF37] bg-[#02130D] px-2 py-0.5 rounded-md border border-[#D4AF37]/30">
                        {isAr
                          ? categories.find((c) => c.id === selectedFacility.category)?.nameAr
                          : categories.find((c) => c.id === selectedFacility.category)?.nameEn}
                      </span>
                      <h3 className="text-sm font-black text-white mt-1">
                        {isAr ? selectedFacility.nameAr : selectedFacility.nameEn}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#F8F3E7]/90 leading-relaxed mb-4">
                  {isAr ? selectedFacility.descAr : selectedFacility.descEn}
                </p>

                {/* Facility Details Badges */}
                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#02130D] border border-[#D4AF37]/20">
                    <span className="text-[#F8F3E7]/70 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{isAr ? 'حالة العمل:' : 'Status:'}</span>
                    </span>
                    <span className="font-bold text-emerald-400">
                      {isAr ? selectedFacility.statusAr : selectedFacility.statusEn}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#02130D] border border-[#D4AF37]/20">
                    <span className="text-[#F8F3E7]/70 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{isAr ? 'المسافة منك:' : 'Distance:'}</span>
                    </span>
                    <span className="font-bold text-amber-300">
                      {selectedFacility.distance} ({selectedFacility.walkTime})
                    </span>
                  </div>
                </div>

                {/* Facility Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${selectedFacility.phone}`}
                    className="py-2.5 px-3 rounded-xl bg-[#02130D] border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02130D] font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{isAr ? `اتصال (${selectedFacility.phone})` : `Call (${selectedFacility.phone})`}</span>
                  </a>

                  <a
                    href={`https://maps.google.com/?q=${selectedFacility.coords}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-[#D4AF37] text-[#02130D] font-black text-xs flex items-center justify-center gap-1.5 transition-all hover:bg-[#F5E5BE] text-center"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{isAr ? 'توجيه الملاحة' : 'Navigate'}</span>
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="bg-[#03291F]/60 border border-[#D4AF37]/30 rounded-3xl p-6 text-center text-xs text-[#F8F3E7]/70">
                <MapPin className="w-8 h-8 text-[#D4AF37] mx-auto mb-2 animate-pulse" />
                <p className="font-bold text-white mb-1">
                  {isAr ? 'انقر على أي نقطة في الخريطة لرؤية تفاصيل المرفق' : 'Click any map pin to view facility details'}
                </p>
                <p>{isAr ? 'يتوفر معها أرقام الاتصال المباشر والتوجيه الجغرافي' : 'Includes direct contacts and turn-by-turn directions'}</p>
              </div>
            )}
          </AnimatePresence>

          {/* Emergency Hotlines Card */}
          <div className="bg-[#02130D] border border-red-500/40 rounded-3xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-red-400 font-black text-xs border-b border-red-500/20 pb-2">
              <ShieldAlert className="w-4 h-4 animate-bounce" />
              <span>{isAr ? 'أرقام الطوارئ السريعة في الحج' : 'Hajj Emergency Hotlines'}</span>
            </div>

            <div className="grid grid-cols-1 gap-2 text-xs">
              <a
                href="tel:937"
                className="p-2.5 rounded-xl bg-[#03291F] border border-red-500/30 flex items-center justify-between hover:border-red-400 transition-all text-white"
              >
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-red-400" />
                  <span className="font-bold">{isAr ? 'الطوارئ الصحية والاستشارات (وزارة الصحة)' : 'Health Emergency (MOH)'}</span>
                </div>
                <span className="font-black text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/40">937</span>
              </a>

              <a
                href="tel:911"
                className="p-2.5 rounded-xl bg-[#03291F] border border-amber-500/30 flex items-center justify-between hover:border-amber-400 transition-all text-white"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span className="font-bold">{isAr ? 'مركز العمليات الأمنية الموحد' : 'Security Operations'}</span>
                </div>
                <span className="font-black text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">911</span>
              </a>

              <a
                href="tel:1966"
                className="p-2.5 rounded-xl bg-[#03291F] border border-cyan-500/30 flex items-center justify-between hover:border-cyan-400 transition-all text-white"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold">{isAr ? 'مركز إرشاد الحجاج والتائهين (وزارة الحج)' : 'Hajj Guidance & Lost Center'}</span>
                </div>
                <span className="font-black text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">1966</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLocationView;
