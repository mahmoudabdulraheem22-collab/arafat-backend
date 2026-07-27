import React, { useState } from 'react';
import {
  User,
  X,
  Smartphone,
  Mail,
  Globe,
  Flag,
  Users,
  PhoneCall,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  Sparkles,
  Edit3,
  LogOut,
  Building2,
  BadgeCheck,
} from 'lucide-react';
import { LanguageOption } from '../../data/languages';
import { CurrencyOption, formatPrice } from '../../data/currencies';

export interface UserProfile {
  name: string;
  country: string;
  nationality: string;
  campaignName: string;
  campaignLeader: string;
  phone?: string;
  email?: string;
  isLoggedIn: boolean;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageOption;
  currency: CurrencyOption;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  language,
  currency,
  userProfile,
  onUpdateProfile,
}) => {
  const isAr = language.code === 'ar';

  const [mode, setMode] = useState<'view' | 'edit' | 'login' | 'subscriptions'>(
    userProfile.isLoggedIn ? 'view' : 'edit'
  );

  // Form State
  const [name, setName] = useState(userProfile.name || '');
  const [country, setCountry] = useState(userProfile.country || (isAr ? 'المملكة العربية السعودية' : 'Saudi Arabia'));
  const [nationality, setNationality] = useState(userProfile.nationality || (isAr ? 'سعودي' : 'Saudi'));
  const [campaignName, setCampaignName] = useState(userProfile.campaignName || (isAr ? 'حملة عرفات المتميزة لحجاج الداخل والخرج' : 'Arafat Premium Hajj Campaign'));
  const [campaignLeader, setCampaignLeader] = useState(userProfile.campaignLeader || (isAr ? 'حملة رقم #8842 - قائد الحملة: م. عبد الله السلمي (0501234567)' : 'Campaign #8842 - Leader: Eng. Abdullah (0501234567)'));
  const [phone, setPhone] = useState(userProfile.phone || '+966500000000');
  const [email, setEmail] = useState(userProfile.email || 'pilgrim@arafat.sa');

  const [subscription, setSubscription] = useState<'free_7_days' | 'monthly' | 'yearly'>('free_7_days');
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setMsg(isAr ? 'يرجى كتابة الاسم الكامل' : 'Please enter full name');
      return;
    }

    const updated: UserProfile = {
      name: name.trim(),
      country: country.trim(),
      nationality: nationality.trim(),
      campaignName: campaignName.trim(),
      campaignLeader: campaignLeader.trim(),
      phone: phone.trim(),
      email: email.trim(),
      isLoggedIn: true,
    };

    onUpdateProfile(updated);
    setMsg(isAr ? 'تم حفظ بياناتك بنجاح وربطها بالهيدر والخدمات!' : 'Profile saved successfully!');
    setMode('view');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      name: name.trim() || (isAr ? 'محمد أحمد' : 'Mohammad Ahmad'),
      country: country.trim() || (isAr ? 'المملكة العربية السعودية' : 'Saudi Arabia'),
      nationality: nationality.trim() || (isAr ? 'سعودي' : 'Saudi'),
      campaignName: campaignName.trim() || (isAr ? 'حملة عرفات المتميزة' : 'Arafat Campaign'),
      campaignLeader: campaignLeader.trim() || (isAr ? 'حملة #8842 (0501234567)' : 'Campaign #8842'),
      phone: phone.trim() || '+966500000000',
      email: email.trim() || 'pilgrim@arafat.sa',
      isLoggedIn: true,
    };
    onUpdateProfile(updated);
    setMsg(isAr ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!');
    setMode('view');
  };

  const handleLogout = () => {
    onUpdateProfile({
      ...userProfile,
      isLoggedIn: false,
    });
    setMsg(isAr ? 'تم تسجيل الخروج' : 'Logged out');
    setMode('edit');
  };

  const handleSubscribe = (plan: 'free_7_days' | 'monthly' | 'yearly') => {
    setSubscription(plan);
    setMsg(
      isAr
        ? `تم تفعيل اشتراكك بنجاح (${plan === 'free_7_days' ? 'تجربة مجانية 7 أيام' : plan === 'monthly' ? 'الاشتراك الشهري' : 'الاشتراك السنوي'})`
        : `Subscription activated: ${plan}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#021811] text-[#F8F3E7] rounded-3xl border-2 border-[#D4AF37] shadow-[0_20px_60px_rgba(0,0,0,0.95)] p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-[#03291F] border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#073D2F] cursor-pointer transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mb-2 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            <User className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#D4AF37] flex items-center justify-center gap-2">
            <span>{isAr ? 'بطاقة بيانات الحاج والمستخدم' : 'Pilgrim Profile & Campaign Data'}</span>
            <BadgeCheck className="w-5 h-5 text-emerald-400" />
          </h2>
          <p className="text-xs text-[#F8F3E7]/70 mt-1">
            {isAr
              ? 'عرض وتعديل الاسم، الجنسية، البلد، بيانات الحملة ورقم القائد'
              : 'Manage name, country, nationality, campaign details, & campaign leader'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 mb-6 border-b border-[#D4AF37]/20 pb-3 flex-wrap">
          {userProfile.isLoggedIn && (
            <button
              type="button"
              onClick={() => setMode('view')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                mode === 'view' ? 'bg-[#D4AF37] text-[#02130D]' : 'bg-[#03291F] text-[#F8F3E7] hover:border-[#D4AF37]'
              }`}
            >
              {isAr ? 'بياناتي المسجلة' : 'My Profile Card'}
            </button>
          )}

          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              mode === 'edit' ? 'bg-[#D4AF37] text-[#02130D]' : 'bg-[#03291F] text-[#F8F3E7] hover:border-[#D4AF37]'
            }`}
          >
            {userProfile.isLoggedIn ? (isAr ? 'تعديل البيانات' : 'Edit Profile') : (isAr ? 'تسجيل جديد' : 'Register')}
          </button>

          {!userProfile.isLoggedIn && (
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                mode === 'login' ? 'bg-[#D4AF37] text-[#02130D]' : 'bg-[#03291F] text-[#F8F3E7] hover:border-[#D4AF37]'
              }`}
            >
              {isAr ? 'تسجيل الدخول' : 'Login'}
            </button>
          )}

          <button
            type="button"
            onClick={() => setMode('subscriptions')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              mode === 'subscriptions' ? 'bg-[#D4AF37] text-[#02130D]' : 'bg-[#03291F] text-[#F8F3E7] hover:border-[#D4AF37]'
            }`}
          >
            {isAr ? 'الاشتراكات والخدمات' : 'Subscriptions'}
          </button>
        </div>

        {msg && (
          <div className="p-3 mb-5 rounded-xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{msg}</span>
          </div>
        )}

        {/* 1. VIEW REGISTERED PROFILE CARD MODE */}
        {mode === 'view' && userProfile.isLoggedIn && (
          <div className="space-y-5">
            {/* Main Pilgrim ID Card */}
            <div className="p-5 bg-gradient-to-br from-[#03291F] via-[#021811] to-[#01120C] border-2 border-[#D4AF37] rounded-2xl shadow-xl relative overflow-hidden space-y-4">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#02130D] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{userProfile.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold inline-block mt-0.5">
                      {isAr ? 'حاج مسجّل وموثق' : 'Verified Registered Pilgrim'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMode('edit')}
                  className="px-3 py-1.5 bg-[#02130D] hover:bg-[#073D2F] border border-[#D4AF37] text-[#D4AF37] font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تعديل' : 'Edit'}</span>
                </button>
              </div>

              {/* Grid of requested user details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* 1. Name */}
                <div className="p-3 bg-[#02130D]/80 border border-[#D4AF37]/30 rounded-xl space-y-1">
                  <span className="text-[10px] text-[#D4AF37] font-bold block flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{isAr ? 'اسم المستخدم / الحاج:' : 'Full Name:'}</span>
                  </span>
                  <p className="font-bold text-white text-sm">{userProfile.name}</p>
                </div>

                {/* 2. Country */}
                <div className="p-3 bg-[#02130D]/80 border border-[#D4AF37]/30 rounded-xl space-y-1">
                  <span className="text-[10px] text-[#D4AF37] font-bold block flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{isAr ? 'بلد الإقامة:' : 'Country:'}</span>
                  </span>
                  <p className="font-bold text-white text-sm">{userProfile.country}</p>
                </div>

                {/* 3. Nationality */}
                <div className="p-3 bg-[#02130D]/80 border border-[#D4AF37]/30 rounded-xl space-y-1">
                  <span className="text-[10px] text-[#D4AF37] font-bold block flex items-center gap-1">
                    <Flag className="w-3.5 h-3.5" />
                    <span>{isAr ? 'الجنسية:' : 'Nationality:'}</span>
                  </span>
                  <p className="font-bold text-white text-sm">{userProfile.nationality}</p>
                </div>

                {/* 4. Campaign Name */}
                <div className="p-3 bg-[#02130D]/80 border border-[#D4AF37]/30 rounded-xl space-y-1">
                  <span className="text-[10px] text-[#D4AF37] font-bold block flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'اسم الحملة / الشركة:' : 'Campaign / Group Name:'}</span>
                  </span>
                  <p className="font-bold text-white text-sm">{userProfile.campaignName}</p>
                </div>

                {/* 5. Campaign Leader / Number */}
                <div className="p-3 bg-[#02130D]/80 border border-[#D4AF37]/30 rounded-xl space-y-1 sm:col-span-2">
                  <span className="text-[10px] text-[#D4AF37] font-bold block flex items-center gap-1">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{isAr ? 'رقم الحملة / قائد الحملة:' : 'Campaign Number / Leader Contact:'}</span>
                  </span>
                  <p className="font-bold text-white text-sm">{userProfile.campaignLeader}</p>
                </div>

                {/* Phone & Email */}
                {userProfile.phone && (
                  <div className="p-3 bg-[#02130D]/80 border border-[#D4AF37]/30 rounded-xl space-y-1">
                    <span className="text-[10px] text-[#D4AF37] font-bold block flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>{isAr ? 'رقم الهاتف (الواتساب):' : 'Phone (WhatsApp):'}</span>
                    </span>
                    <p className="font-mono text-white">{userProfile.phone}</p>
                  </div>
                )}

                {userProfile.email && (
                  <div className="p-3 bg-[#02130D]/80 border border-[#D4AF37]/30 rounded-xl space-y-1">
                    <span className="text-[10px] text-[#D4AF37] font-bold block flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{isAr ? 'البريد الإلكتروني:' : 'Email Address:'}</span>
                    </span>
                    <p className="font-mono text-white">{userProfile.email}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMode('subscriptions')}
                className="flex-1 py-3 bg-[#D4AF37] hover:bg-[#F5E5BE] text-[#02130D] font-black text-xs rounded-xl transition-all cursor-pointer shadow-lg text-center"
              >
                {isAr ? 'إدارة الاشتراك والخدمات' : 'Manage Subscription'}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-3 bg-red-950/60 hover:bg-red-900 border border-red-500/50 text-red-300 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>{isAr ? 'خروج' : 'Logout'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. EDIT / REGISTER FORM MODE */}
        {mode === 'edit' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* 1. Name */}
            <div>
              <label className="text-xs text-[#D4AF37] font-bold block mb-1">
                {isAr ? 'الاسم الكامل للحاج / المستخدم:' : 'Full Name:'}
              </label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#03291F] border border-[#D4AF37]/40">
                <User className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isAr ? 'مثال: محمد أحمد علي' : 'Full Name'}
                  required
                  className="w-full bg-transparent text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* 2. Country & 3. Nationality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#D4AF37] font-bold block mb-1">
                  {isAr ? 'بلد الإقامة:' : 'Country of Residence:'}
                </label>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#03291F] border border-[#D4AF37]/40">
                  <Globe className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder={isAr ? 'المملكة العربية السعودية' : 'Country'}
                    required
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#D4AF37] font-bold block mb-1">
                  {isAr ? 'الجنسية:' : 'Nationality:'}
                </label>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#03291F] border border-[#D4AF37]/40">
                  <Flag className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder={isAr ? 'مثال: سعودي / مصري / باكستاني' : 'Nationality'}
                    required
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Campaign Name */}
            <div>
              <label className="text-xs text-[#D4AF37] font-bold block mb-1">
                {isAr ? 'اسم الحملة / الشركة المنظمة:' : 'Campaign / Group Name:'}
              </label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#03291F] border border-[#D4AF37]/40">
                <Building2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder={isAr ? 'مثال: حملة عرفات المتميزة' : 'Campaign Name'}
                  required
                  className="w-full bg-transparent text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* 5. Campaign Leader / Number */}
            <div>
              <label className="text-xs text-[#D4AF37] font-bold block mb-1">
                {isAr ? 'رقم الحملة أو اسم/رقم قائد الحملة:' : 'Campaign Number / Leader Info:'}
              </label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#03291F] border border-[#D4AF37]/40">
                <PhoneCall className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <input
                  type="text"
                  value={campaignLeader}
                  onChange={(e) => setCampaignLeader(e.target.value)}
                  placeholder={isAr ? 'مثال: حملة رقم #8842 - قائد الحملة: أ. عبد الله (0501234567)' : 'Campaign # / Leader Name'}
                  required
                  className="w-full bg-transparent text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#D4AF37] font-bold block mb-1">
                  {isAr ? 'رقم الواتساب للتنبيهات:' : 'WhatsApp Phone:'}
                </label>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#03291F] border border-[#D4AF37]/40">
                  <Smartphone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+966 50 000 0000"
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#D4AF37] font-bold block mb-1">
                  {isAr ? 'البريد الإلكتروني:' : 'Email Address:'}
                </label>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#03291F] border border-[#D4AF37]/40">
                  <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#03291F]/60 border border-[#D4AF37]/20 text-[11px] text-[#F8F3E7]/80 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {isAr
                  ? 'سيتم حفظ اسمك وبيانات حملتك والظهور فوراً في الهيدر العلوي وأقسام المنصة.'
                  : 'Your profile will be immediately updated in the header & system.'}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#02130D] font-black text-xs hover:from-[#E5C158] transition-all cursor-pointer shadow-lg"
            >
              {isAr ? 'حفظ البيانات وتأكيد التسجيل' : 'Save Profile & Confirm Registration'}
            </button>
          </form>
        )}

        {/* 3. LOGIN MODE */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-[#D4AF37] font-bold block mb-1">
                {isAr ? 'الاسم أو رقم الهاتف المسجل:' : 'Registered Name or Phone:'}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+966 50 000 0000"
                required
                className="w-full p-3 rounded-xl bg-[#03291F] border border-[#D4AF37]/40 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#02130D] font-black text-xs hover:from-[#E5C158] transition-all cursor-pointer shadow-lg"
            >
              {isAr ? 'تسجيل الدخول إلى حسابي' : 'Login to My Account'}
            </button>
          </form>
        )}

        {/* 4. SUBSCRIPTIONS MODE */}
        {mode === 'subscriptions' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#D4AF37] text-center mb-2">
              {isAr ? 'اختر خيار الاشتراك المناسب لك:' : 'Select Subscription Plan:'}
            </h3>

            {/* Plan 1: Free 7 Days */}
            <div
              onClick={() => handleSubscribe('free_7_days')}
              className={`p-4 rounded-2xl border text-start transition-all cursor-pointer flex items-center justify-between ${
                subscription === 'free_7_days'
                  ? 'bg-[#03291F] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-[#02130D] border-[#D4AF37]/30 hover:border-[#D4AF37]'
              }`}
            >
              <div>
                <span className="text-xs font-black text-[#D4AF37] block">
                  {isAr ? 'تجربة مجانية لمدة 7 أيام' : '7 Days Free Trial'}
                </span>
                <span className="text-[11px] text-[#F8F3E7]/70">
                  {isAr ? 'استخدام كامل لكافة أدوات المنصة والوكيل الذكي مجاناً' : 'Full access to all AI tools & guidance for 7 days'}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs border border-emerald-500/40">
                {isAr ? 'مجاني 100%' : '100% Free'}
              </span>
            </div>

            {/* Plan 2: Monthly */}
            <div
              onClick={() => handleSubscribe('monthly')}
              className={`p-4 rounded-2xl border text-start transition-all cursor-pointer flex items-center justify-between ${
                subscription === 'monthly'
                  ? 'bg-[#03291F] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-[#02130D] border-[#D4AF37]/30 hover:border-[#D4AF37]'
              }`}
            >
              <div>
                <span className="text-xs font-black text-[#D4AF37] block">
                  {isAr ? 'الاشتراك الشهري المتقدم' : 'Monthly Premium Subscription'}
                </span>
                <span className="text-[11px] text-[#F8F3E7]/70">
                  {isAr ? 'تجديد شهري، استشارات مفتوحة وإشعار الواتساب' : 'Monthly renewal, unlimited AI consultations & WhatsApp alerts'}
                </span>
              </div>
              <span className="font-black text-sm text-white">
                {formatPrice(49, currency)} / {isAr ? 'شهر' : 'mo'}
              </span>
            </div>

            {/* Plan 3: Yearly */}
            <div
              onClick={() => handleSubscribe('yearly')}
              className={`p-4 rounded-2xl border text-start transition-all cursor-pointer flex items-center justify-between ${
                subscription === 'yearly'
                  ? 'bg-[#03291F] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-[#02130D] border-[#D4AF37]/30 hover:border-[#D4AF37]'
              }`}
            >
              <div>
                <span className="text-xs font-black text-[#D4AF37] block flex items-center gap-1">
                  <span>{isAr ? 'الاشتراك السنوي الشامل' : 'Yearly Unlimited Subscription'}</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                </span>
                <span className="text-[11px] text-[#F8F3E7]/70">
                  {isAr ? 'خصم 40%، دعم VIP وإدارة باقات العائلة لعام كامل' : 'Save 40%, VIP support & full family planning for 1 year'}
                </span>
              </div>
              <span className="font-black text-sm text-white">
                {formatPrice(290, currency)} / {isAr ? 'سنة' : 'yr'}
              </span>
            </div>

            {/* Simulated Payment Methods */}
            <div className="pt-2 border-t border-[#D4AF37]/20 text-center">
              <span className="text-[10px] text-[#D4AF37] block mb-2 font-bold">{isAr ? 'طرق الدفع الآمنة المتاحة:' : 'Secure Payment Gateways:'}</span>
              <div className="flex items-center justify-center gap-3 text-xs text-[#F8F3E7]/80">
                <span className="px-2.5 py-1 rounded-lg bg-[#03291F] border border-[#D4AF37]/30 font-bold">Mada / مدى</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#03291F] border border-[#D4AF37]/30 font-bold">Apple Pay</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#03291F] border border-[#D4AF37]/30 font-bold">Visa / Master</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;
