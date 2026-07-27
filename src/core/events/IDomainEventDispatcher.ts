/**
 * @file IDomainEventDispatcher.ts
 * @module core/events
 * @description عقد (Interface) موزع أحداث النطاق (Domain Event Dispatcher) لتسجيل معالجات الأحداث ونشرها.
 */

import { IDomainEvent } from './IDomainEvent';

/**
 * دالة إلغاء الاشتراك من استقبال الأحداث
 */
export type Unsubscribe = () => void;

/**
 * نوع دالة معالجة حدث النطاق (تستقبل حدثاً مفصلاً وتدعم المعالجة المتزامنة وغير المتزامنة)
 * @template E نوع حدث النطاق
 */
export type DomainEventHandler<E extends IDomainEvent<unknown> = IDomainEvent<unknown>> = (
  event: E
) => Promise<void> | void;

/**
 * العقد المعياري لموزع أحداث النطاق (Domain Event Dispatcher Contract)
 */
export interface IDomainEventDispatcher {
  /**
   * تسجيل معالج لحدث نطاق محدد بواسطة اسمه الثابت (eventName)
   * @template E نوع حدث النطاق
   * @param {string} eventName اسم الحدث الثابت
   * @param {DomainEventHandler<E>} handler دالة معالجة الحدث
   * @returns {Unsubscribe} دالة لإلغاء الاشتراك
   */
  register<E extends IDomainEvent<unknown>>(
    eventName: string,
    handler: DomainEventHandler<E>
  ): Unsubscribe;

  /**
   * نشر حدث نطاق واحد وإرساله إلى جميع المعالجات المسجلة له
   * @template E نوع حدث النطاق
   * @param {E} event كائن حدث النطاق المراد نشره
   * @returns {Promise<void>}
   */
  dispatch<E extends IDomainEvent<unknown>>(event: E): Promise<void>;

  /**
   * مسح جميع المعالجات المسجلة لحدث معين
   * @param {string} eventName اسم الحدث المراد مسح معالجته
   */
  clearHandlersForEvent(eventName: string): void;

  /**
   * مسح كافة المعالجات المسجلة لجميع الأحداث
   */
  clearAllHandlers(): void;
}
