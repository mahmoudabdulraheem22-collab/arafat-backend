import React, { useState, useEffect } from 'react';
import {
  Wallet,
  PlusCircle,
  TrendingDown,
  TrendingUp,
  PieChart,
  Car,
  Utensils,
  Gift,
  Building,
  DollarSign,
  Calendar,
  CreditCard,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Share2,
  RotateCcw,
  Tag,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { CurrencyOption, formatPrice } from '../../data/currencies';
import { LanguageOption } from '../../data/languages';

export interface ExpenseItem {
  id: string;
  amount: number;
  category: 'transport' | 'food' | 'gifts' | 'stay' | 'hady' | 'other';
  title: string;
  date: string;
  paymentMethod: 'cash' | 'card';
  notes?: string;
}

export interface HajjExpenseTrackerProps {
  currency: CurrencyOption;
  language: LanguageOption;
  onSendToWhatsapp: (details: string) => void;
}

export const HajjExpenseTracker: React.FC<HajjExpenseTrackerProps> = ({
  currency,
  language,
  onSendToWhatsapp,
}) => {
  const isAr = language.code === 'ar';

  // 1. Storage key
  const STORAGE_KEY = 'arafat_hajj_expense_tracker_v1';

  // 2. Budget State
  const [totalBudget, setTotalBudget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_budget`);
      return saved ? parseFloat(saved) : 5000;
    } catch {
      return 5000;
    }
  });

  // 3. Expenses List State
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_items`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved expenses:', e);
    }
    // Default initial sample items for quick demo if empty
    return [
      {
        id: 'exp_1',
        amount: 220,
        category: 'transport',
        title: isAr ? 'تذكرة قطار الحرمين مكة - المدينة' : 'Haramain Train Ticket',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'card',
      },
      {
        id: 'exp_2',
        amount: 85,
        category: 'food',
        title: isAr ? 'وجبة إعاشة ومشروبات في منى' : 'Meals & Refreshments in Mina',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
      },
      {
        id: 'exp_3',
        amount: 350,
        category: 'gifts',
        title: isAr ? 'سجادات صلاة وعطور هدايا للأهل' : 'Prayer Rugs & Perfumes Gifts',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'card',
      },
    ];
  });

  // Form State
  const [amountInput, setAmountInput] = useState<string>('');
  const [titleInput, setTitleInput] = useState<string>('');
  const [categoryInput, setCategoryInput] = useState<ExpenseItem['category']>('transport');
  const [paymentMethodInput, setPaymentMethodInput] = useState<'cash' | 'card'>('card');
  const [dateInput, setDateInput] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [isEditingBudget, setIsEditingBudget] = useState<boolean>(false);
  const [tempBudgetInput, setTempBudgetInput] = useState<string>(totalBudget.toString());

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_budget`, totalBudget.toString());
      localStorage.setItem(`${STORAGE_KEY}_items`, JSON.stringify(expenses));
    } catch (e) {
      console.error('Failed to save expenses to localStorage:', e);
    }
  }, [totalBudget, expenses]);

  // Categories config
  const categoriesMap = {
    transport: {
      id: 'transport',
      labelAr: 'المواصلات والتنقل',
      labelEn: 'Transport & Commute',
      icon: Car,
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      badgeBg: 'bg-amber-500',
    },
    food: {
      id: 'food',
      labelAr: 'الطعام والإعاشة',
      labelEn: 'Food & Dining',
      icon: Utensils,
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      badgeBg: 'bg-emerald-500',
    },
    gifts: {
      id: 'gifts',
      labelAr: 'الهدايا والتذكارات',
      labelEn: 'Gifts & Souvenirs',
      icon: Gift,
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      badgeBg: 'bg-purple-500',
    },
    stay: {
      id: 'stay',
      labelAr: 'السكن والإقامة',
      labelEn: 'Stay & Hotel',
      icon: Building,
      color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      badgeBg: 'bg-blue-500',
    },
    hady: {
      id: 'hady',
      labelAr: 'الهدي والأضاحي',
      labelEn: 'Sacrificial Hady',
      icon: Tag,
      color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      badgeBg: 'bg-rose-500',
    },
    other: {
      id: 'other',
      labelAr: 'مصاريف عامة وطوارئ',
      labelEn: 'Other & Contingency',
      icon: DollarSign,
      color: 'bg-gray-500/20 text-gray-300 border-gray-500/40',
      badgeBg: 'bg-gray-500',
    },
  };

  // Dynamic calculations
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remainingBalance = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

  // Category breakdown totals
  const categoryTotals = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {} as Record<string, number>);

  // Find top spending category
  const topCategoryKey = (Object.entries(categoryTotals) as [string, number][]).sort((a, b) => b[1] - a[1])[0]?.[0] as ExpenseItem['category'] | undefined;

  // Status gauge color
  let statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  let statusTextAr = 'رصيد آمن ومستقر';
  let statusTextEn = 'Safe Balance';

  if (remainingBalance < 0) {
    statusColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30 animate-pulse';
    statusTextAr = 'تجاوزت الميزانية المحددة!';
    statusTextEn = 'Budget Exceeded!';
  } else if (spentPercentage >= 80) {
    statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    statusTextAr = 'تنبيه: اقتربت من نفاد الميزانية';
    statusTextEn = 'Caution: Near Budget Limit';
  }

  // Add new expense handler
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amountInput);
    if (isNaN(val) || val <= 0) {
      alert(isAr ? 'الرجاء إدخال مبلغ صحيح' : 'Please enter a valid amount');
      return;
    }
    if (!titleInput.trim()) {
      alert(isAr ? 'الرجاء إدخال بيان أو وصف المصروف' : 'Please enter expense description');
      return;
    }

    const newItem: ExpenseItem = {
      id: `exp_${Date.now()}`,
      amount: val,
      category: categoryInput,
      title: titleInput.trim(),
      date: dateInput || new Date().toISOString().split('T')[0],
      paymentMethod: paymentMethodInput,
    };

    setExpenses([newItem, ...expenses]);
    setAmountInput('');
    setTitleInput('');
  };

  // Quick preset shortcuts
  const applyPreset = (presetTitleAr: string, presetTitleEn: string, presetCategory: ExpenseItem['category'], presetAmount: number) => {
    const newItem: ExpenseItem = {
      id: `exp_${Date.now()}`,
      amount: presetAmount,
      category: presetCategory,
      title: isAr ? presetTitleAr : presetTitleEn,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'card',
    };
    setExpenses([newItem, ...expenses]);
  };

  // Delete expense
  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // Update budget
  const handleSaveBudget = () => {
    const b = parseFloat(tempBudgetInput);
    if (!isNaN(b) && b > 0) {
      setTotalBudget(b);
      setIsEditingBudget(false);
    }
  };

  // Filtered expense items
  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Share via WhatsApp
  const handleShareSummary = () => {
    const summaryText = isAr
      ? `*تقرير المصاريف المباشرة لرحلة الحج والعمرة (منصة عرفات)*:\n` +
        `- الميزانية المحددة: ${formatPrice(totalBudget, currency)}\n` +
        `- إجمالي المصاريف حتى الآن: ${formatPrice(totalSpent, currency)}\n` +
        `- الرصيد المتبقي: ${formatPrice(remainingBalance, currency)}\n` +
        `- إجمالي التنقل والمواصلات: ${formatPrice(categoryTotals['transport'] || 0, currency)}\n` +
        `- إجمالي الطعام والإعاشة: ${formatPrice(categoryTotals['food'] || 0, currency)}\n` +
        `- إجمالي الهدايا والتذكارات: ${formatPrice(categoryTotals['gifts'] || 0, currency)}\n` +
        `- إجمالي السكن: ${formatPrice(categoryTotals['stay'] || 0, currency)}\n` +
        `- إجمالي الهدي والأضاحي: ${formatPrice(categoryTotals['hady'] || 0, currency)}\n` +
        `عدد المعاملات المسجلة: ${expenses.length}`
      : `*Hajj & Umrah Live Expenses Report (Arafat App)*:\n` +
        `- Total Budget: ${formatPrice(totalBudget, currency)}\n` +
        `- Total Spent: ${formatPrice(totalSpent, currency)}\n` +
        `- Remaining Balance: ${formatPrice(remainingBalance, currency)}\n` +
        `- Transport: ${formatPrice(categoryTotals['transport'] || 0, currency)}\n` +
        `- Food: ${formatPrice(categoryTotals['food'] || 0, currency)}\n` +
        `- Gifts: ${formatPrice(categoryTotals['gifts'] || 0, currency)}\n` +
        `- Logged items: ${expenses.length}`;

    onSendToWhatsapp(summaryText);
  };

  // Clear all
  const handleClearAll = () => {
    if (confirm(isAr ? 'هل أنت تأكد من إعادة ضبط وحذف كافة المصروفات المسجلة؟' : 'Are you sure you want to clear all expenses?')) {
      setExpenses([]);
    }
  };

  return (
    <div className="space-y-6 dir-rtl">
      {/* 1. Header & Budget Config Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#03291F] via-[#021811] to-[#03291F] border border-[#D4AF37]/40 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#D4AF37]">
              {isAr ? 'متتبع مصاريف الحج والميزانية المباشرة' : 'Live Hajj Expense Tracker'}
            </h3>
            <p className="text-xs text-[#F8F3E7]/70">
              {isAr ? 'سجّل مصاريفك اليومية (المواصلات، الطعام، الهدايا...) وتتبع رصيدك لحظة بلحظة' : 'Log daily expenses (Transport, Food, Gifts) & monitor balance in real time'}
            </p>
          </div>
        </div>

        {/* Budget Setting Badge */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {isEditingBudget ? (
            <div className="flex items-center gap-2 bg-[#02130D] p-1.5 rounded-xl border border-[#D4AF37]">
              <input
                type="number"
                value={tempBudgetInput}
                onChange={(e) => setTempBudgetInput(e.target.value)}
                className="w-28 bg-transparent text-white font-bold text-sm text-center focus:outline-none"
                placeholder={isAr ? 'الميزانية' : 'Budget'}
              />
              <button
                type="button"
                onClick={handleSaveBudget}
                className="px-3 py-1 bg-[#D4AF37] text-[#02130D] font-bold text-xs rounded-lg hover:bg-amber-300 transition-all"
              >
                {isAr ? 'حفظ' : 'Save'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#02130D] border border-[#D4AF37]/50">
              <div className="text-right">
                <span className="text-[10px] text-[#D4AF37] block font-bold">{isAr ? 'الميزانية الكلية:' : 'Total Budget:'}</span>
                <span className="text-sm font-black text-white">{formatPrice(totalBudget, currency)}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTempBudgetInput(totalBudget.toString());
                  setIsEditingBudget(true);
                }}
                className="p-1.5 rounded-lg bg-[#03291F] text-[#D4AF37] hover:bg-[#073D2F] transition-all cursor-pointer mr-1"
                title={isAr ? 'تعديل الميزانية' : 'Edit Budget'}
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleShareSummary}
            className="p-2.5 rounded-xl bg-[#03291F] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#073D2F] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shrink-0"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">{isAr ? 'مشاركة' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* 2. Key Summary Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Budget */}
        <div className="p-4 rounded-2xl bg-[#03291F] border border-[#D4AF37]/40 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#D4AF37] font-bold">
            <span>{isAr ? 'الميزانية الكلية' : 'Total Budget'}</span>
            <Wallet className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-2xl font-black text-white pt-1">
            {formatPrice(totalBudget, currency)}
          </div>
          <p className="text-[11px] text-[#F8F3E7]/60">
            {isAr ? 'المبلغ المخصص للحج والرحلة' : 'Allocated trip budget'}
          </p>
        </div>

        {/* Card 2: Total Spent */}
        <div className="p-4 rounded-2xl bg-[#03291F] border border-amber-500/40 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
            <span>{isAr ? 'إجمالي المصاريف' : 'Total Spent'}</span>
            <TrendingDown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 pt-1">
            {formatPrice(totalSpent, currency)}
          </div>
          <p className="text-[11px] text-amber-200/70">
            {isAr ? `${spentPercentage}% من إجمالي الميزانية` : `${spentPercentage}% of total budget`}
          </p>
        </div>

        {/* Card 3: Remaining Balance */}
        <div className={`p-4 rounded-2xl border space-y-1 relative overflow-hidden transition-all ${
          remainingBalance < 0
            ? 'bg-rose-950/40 border-rose-500/60'
            : 'bg-[#03291F] border-emerald-500/40'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className={remainingBalance < 0 ? 'text-rose-300' : 'text-emerald-300'}>
              {isAr ? 'الرصيد المتبقي' : 'Remaining Balance'}
            </span>
            <TrendingUp className={`w-4 h-4 ${remainingBalance < 0 ? 'text-rose-400' : 'text-emerald-400'}`} />
          </div>
          <div className={`text-2xl font-black pt-1 ${remainingBalance < 0 ? 'text-rose-300' : 'text-emerald-300'}`}>
            {formatPrice(remainingBalance, currency)}
          </div>
          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor}`}>
            {isAr ? statusTextAr : statusTextEn}
          </span>
        </div>

        {/* Card 4: Top Category */}
        <div className="p-4 rounded-2xl bg-[#03291F] border border-[#D4AF37]/40 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#D4AF37] font-bold">
            <span>{isAr ? 'أعلى إنفاقاً' : 'Highest Category'}</span>
            <PieChart className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-lg font-black text-white pt-1 truncate">
            {topCategoryKey ? (
              isAr ? categoriesMap[topCategoryKey].labelAr : categoriesMap[topCategoryKey].labelEn
            ) : (
              isAr ? 'لا يوجد مصاريف' : 'No expenses yet'
            )}
          </div>
          <p className="text-[11px] text-[#F8F3E7]/60">
            {topCategoryKey ? formatPrice(categoryTotals[topCategoryKey], currency) : '-'}
          </p>
        </div>
      </div>

      {/* Visual Progress Meter Bar */}
      <div className="p-4 rounded-2xl bg-[#02130D] border border-[#D4AF37]/30 space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-[#D4AF37] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'مؤشر استهلاك الميزانية' : 'Budget Usage Gauge'}</span>
          </span>
          <span className="text-white font-mono">
            {formatPrice(totalSpent, currency)} / {formatPrice(totalBudget, currency)} ({spentPercentage}%)
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-[#03291F] overflow-hidden p-0.5 border border-[#D4AF37]/20 relative">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              remainingBalance < 0
                ? 'bg-rose-500'
                : spentPercentage > 80
                ? 'bg-amber-400'
                : 'bg-gradient-to-r from-emerald-500 via-[#D4AF37] to-emerald-400'
            }`}
            style={{ width: `${Math.min(100, spentPercentage)}%` }}
          />
        </div>
      </div>

      {/* 3. Main Grid: Add Form + Quick Presets + Expenses List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Form */}
          <form onSubmit={handleAddExpense} className="p-5 rounded-2xl bg-[#03291F] border border-[#D4AF37]/40 space-y-4 shadow-md">
            <h4 className="text-sm font-black text-[#D4AF37] flex items-center gap-2 border-b border-[#D4AF37]/20 pb-2">
              <PlusCircle className="w-4 h-4" />
              <span>{isAr ? 'تسجيل مصروف جديد' : 'Log New Expense'}</span>
            </h4>

            {/* Title / Description */}
            <div>
              <label className="text-xs text-[#F8F3E7]/80 block mb-1 font-semibold">
                {isAr ? 'بيان المصروف (المسمى):' : 'Expense Description:'}
              </label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder={isAr ? 'مثال: أوزان إضافية / غداء / هدايا مكة' : 'e.g., Train ticket, Lunch, Souvenirs'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#02130D] border border-[#D4AF37]/40 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Amount & Currency */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#F8F3E7]/80 block mb-1 font-semibold">
                  {isAr ? 'المبلغ:' : 'Amount:'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#02130D] border border-[#D4AF37]/40 text-white font-bold text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                  <span className="absolute left-2.5 top-2.5 text-[10px] text-[#D4AF37] font-bold">
                    {currency.code}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#F8F3E7]/80 block mb-1 font-semibold">
                  {isAr ? 'التاريخ:' : 'Date:'}
                </label>
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#02130D] border border-[#D4AF37]/40 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="text-xs text-[#F8F3E7]/80 block mb-1 font-semibold">
                {isAr ? 'التصنيف الرئيسية:' : 'Category:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(categoriesMap).map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = categoryInput === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryInput(cat.id as any)}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#D4AF37] text-[#02130D] border-white shadow-md'
                          : 'bg-[#02130D] text-[#F8F3E7]/80 border-[#D4AF37]/30 hover:border-[#D4AF37]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{isAr ? cat.labelAr : cat.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-xs text-[#F8F3E7]/80 block mb-1 font-semibold">
                {isAr ? 'طريقة الدفع:' : 'Payment Method:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethodInput('card')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethodInput === 'card'
                      ? 'bg-emerald-500 text-white border-emerald-300'
                      : 'bg-[#02130D] text-gray-300 border-[#D4AF37]/30'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{isAr ? 'بطاقة / مدى / الفيزا' : 'Card / Mada'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethodInput('cash')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethodInput === 'cash'
                      ? 'bg-amber-500 text-[#02130D] border-amber-300'
                      : 'bg-[#02130D] text-gray-300 border-[#D4AF37]/30'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{isAr ? 'نقداً (كاش)' : 'Cash'}</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-amber-300 text-[#02130D] font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4 fill-current" />
              <span>{isAr ? 'إضافة المصروف فوراً' : 'Add Expense Now'}</span>
            </button>
          </form>

          {/* Quick Preset Buttons */}
          <div className="p-4 rounded-2xl bg-[#03291F]/70 border border-[#D4AF37]/30 space-y-2">
            <span className="text-xs font-bold text-[#D4AF37] block">
              ⚡ {isAr ? 'إضافة سريعة لمصاريف الحج الشائعة:' : 'Quick Shortcuts:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { titleAr: 'ماء زمزم ومرطبات', titleEn: 'Zamzam & Water', cat: 'food', amount: 30 },
                { titleAr: 'تاكسي الحرم / المشاعر', titleEn: 'Haram Taxi', cat: 'transport', amount: 100 },
                { titleAr: 'هدايا سجادة صلاة وعطور', titleEn: 'Prayer Mats Gifts', cat: 'gifts', amount: 200 },
                { titleAr: 'شراء كارت هدي / أضحية', titleEn: 'Sacrificial Hady Voucher', cat: 'hady', amount: 750 },
                { titleAr: 'وجبة طعام سريعة', titleEn: 'Quick Meal', cat: 'food', amount: 45 },
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p.titleAr, p.titleEn, p.cat as any, p.amount)}
                  className="px-2.5 py-1 rounded-lg bg-[#02130D] hover:bg-[#D4AF37] hover:text-[#02130D] border border-[#D4AF37]/30 text-[11px] font-bold text-[#F8F3E7] transition-colors cursor-pointer"
                >
                  + {p.amount} {currency.code} ({isAr ? p.titleAr : p.titleEn})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Categories Breakdown + Logged Expenses (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Categories Summary List */}
          <div className="p-4 rounded-2xl bg-[#03291F] border border-[#D4AF37]/30 space-y-3">
            <h4 className="text-xs font-bold text-[#D4AF37] flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
              <span className="flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'توزيع المصاريف حسب التصنيفات' : 'Expenses Breakdown by Category'}</span>
              </span>
              <span className="text-[11px] text-[#F8F3E7]/60">
                {isAr ? 'النسبة من إجمالي المصاريف' : '% of total expenses'}
              </span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Object.values(categoriesMap).map((cat) => {
                const Icon = cat.icon;
                const catSpent = categoryTotals[cat.id] || 0;
                const pctOfSpent = totalSpent > 0 ? Math.round((catSpent / totalSpent) * 100) : 0;

                return (
                  <div key={cat.id} className="p-2.5 rounded-xl bg-[#02130D] border border-[#D4AF37]/20 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <div className={`p-1 rounded-lg border text-xs ${cat.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-bold text-white truncate">
                        {isAr ? cat.labelAr : cat.labelEn}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-xs font-black text-[#D4AF37]">
                        {formatPrice(catSpent, currency)}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">{pctOfSpent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Logged Expenses Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#03291F] border border-[#D4AF37]/40 space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#D4AF37]/20 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#D4AF37]" />
                <h4 className="text-sm font-black text-white">
                  {isAr ? 'سجل المصروفات والعمليات' : 'Expenses History Log'}
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-mono text-[10px] font-bold">
                  {filteredExpenses.length}
                </span>
              </div>

              {expenses.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[11px] text-rose-300 hover:text-rose-100 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isAr ? 'إعادة ضبط وحذف الكل' : 'Clear All'}</span>
                </button>
              )}
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute right-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'بحث في السجل...' : 'Search log...'}
                  className="w-full pr-8 pl-3 py-2 rounded-xl bg-[#02130D] border border-[#D4AF37]/30 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#02130D] border border-[#D4AF37]/30 text-white text-xs focus:outline-none focus:border-[#D4AF37] cursor-pointer"
              >
                <option value="all">{isAr ? 'جميع التصنيفات' : 'All Categories'}</option>
                {Object.values(categoriesMap).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {isAr ? cat.labelAr : cat.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
              {filteredExpenses.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400 border border-dashed border-[#D4AF37]/30 rounded-2xl space-y-1">
                  <p>{isAr ? 'لا توجد مصاريف مسجلة مطابقة' : 'No expenses logged matching search'}</p>
                </div>
              ) : (
                filteredExpenses.map((item) => {
                  const catConfig = categoriesMap[item.category] || categoriesMap['other'];
                  const Icon = catConfig.icon;

                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-[#02130D] border border-[#D4AF37]/25 hover:border-[#D4AF37] transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`p-2.5 rounded-xl border text-xs shrink-0 ${catConfig.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-bold text-white truncate">
                            {item.title}
                          </h5>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                            <span>{item.date}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-[#D4AF37]">
                              {item.paymentMethod === 'card' ? (
                                <>
                                  <CreditCard className="w-3 h-3" />
                                  <span>{isAr ? 'بطاقة' : 'Card'}</span>
                                </>
                              ) : (
                                <>
                                  <DollarSign className="w-3 h-3" />
                                  <span>{isAr ? 'نقداً' : 'Cash'}</span>
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-black text-amber-300 font-mono">
                          {formatPrice(item.amount, currency)}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleDeleteExpense(item.id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60 transition-colors cursor-pointer"
                          title={isAr ? 'حذف المصروف' : 'Delete'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
