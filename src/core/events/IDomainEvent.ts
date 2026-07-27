/**
 * @file IDomainEvent.ts
 * @module core/events
 * @description الواجهة المعيارية لجميع أحداث النطاق (Domain Events) في منصة «عرفات».
 * تمثل الأحداث تغييرات ووقائع حتمية حدثت بالفعل داخل منطق الأعمال، وتُستخدم لتفعيل التنسيق غير المتزامن بين الكيانات والخدمات.
 */

export interface IDomainEvent<ID = string> {
  /**
   * اسم أو معرف الحدث الثابت (Event Name)
   */
  readonly eventName: string;

  /**
   * الوقت والتاريخ الدقيق لحدوث الحدث (Timestamp)
   */
  readonly dateTimeOccurred: Date;

  /**
   * الحصول على معرف الجذر المجمع (Aggregate Root ID) الذي صدر عنه هذا الحدث
   * @returns {ID} معرف الكيان المجمع
   */
  getAggregateId(): ID;
}
