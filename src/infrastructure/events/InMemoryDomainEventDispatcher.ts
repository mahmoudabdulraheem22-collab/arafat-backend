/**
 * @file InMemoryDomainEventDispatcher.ts
 * @module infrastructure/events
 * @description التنفيذ الفعلي المعتمد على الذاكرة لموزع أحداث النطاق (In-Memory Domain Event Dispatcher).
 * يطبق عقد IDomainEventDispatcher ليدعم حقن الاعتماديات (Dependency Injection) وإدارة المعالجات داخل طبقة البنية التحتية.
 * 
 * ملاحظة معمارية: يجب أن تمثل جميع الأحداث التي تشترك في نفس قيمة eventName العقد المنطقي وهيكل البيانات ذاته،
 * حيث يتم محو الأنواع العامة (Type Erasure) في بيئة التشغيل (Runtime).
 */

import { IDomainEvent } from '../../core/events/IDomainEvent';
import {
  IDomainEventDispatcher,
  DomainEventHandler,
  Unsubscribe,
} from '../../core/events/IDomainEventDispatcher';

/**
 * موزّع أحداث النطاق في الذاكرة (In-Memory Domain Event Dispatcher)
 */
export class InMemoryDomainEventDispatcher implements IDomainEventDispatcher {
  private readonly handlersMap: Map<string, DomainEventHandler<IDomainEvent<unknown>>[]> = new Map();

  /**
   * تسجيل معالج لحدث نطاق معين بواسطة اسمه الثابت (eventName).
   * يمنع تكرار المرجع نفسه للمُعالج، ويُرجع دالة إلغاء اشتراك لا تفعل شيئاً إذا كان المعالج مسجلاً بالفعل.
   * 
   * @template E نوع حدث النطاق
   * @param {string} eventName اسم الحدث الثابت
   * @param {DomainEventHandler<E>} handler دالة معالجة الحدث
   * @returns {Unsubscribe} دالة لإلغاء الاشتراك
   */
  public register<E extends IDomainEvent<unknown>>(
    eventName: string,
    handler: DomainEventHandler<E>
  ): Unsubscribe {
    if (typeof eventName !== 'string' || eventName.trim().length === 0) {
      throw new Error('[InMemoryDomainEventDispatcher] Event name must be a valid non-empty string.');
    }

    if (!this.handlersMap.has(eventName)) {
      this.handlersMap.set(eventName, []);
    }

    const handlers = this.handlersMap.get(eventName)!;
    const genericHandler = handler as DomainEventHandler<IDomainEvent<unknown>>;

    // إذا كان المعالج مسجلاً بالفعل لذات الحدث، نعيد دالة إلغاء اشتراك غير فعالة تجنباً لإلغاء تسجيلات سابقة
    if (handlers.includes(genericHandler)) {
      return () => undefined;
    }

    handlers.push(genericHandler);

    // إرجاع دالة إلغاء الاشتراك (Unsubscribe) الخاصة بهذا التسجيل
    return () => {
      const currentHandlers = this.handlersMap.get(eventName);
      if (!currentHandlers) {
        return;
      }
      const index = currentHandlers.indexOf(genericHandler);
      if (index !== -1) {
        currentHandlers.splice(index, 1);
      }
      if (currentHandlers.length === 0) {
        this.handlersMap.delete(eventName);
      }
    };
  }

  /**
   * نشر حدث نطاق وإرساله لجميع المعالجات المسجلة بالتسلسل.
   * يُنفذ المعالجات على أخذ نسخة دفاعية من القائمة لتجنب مشاكل التعديل أثناء النشر.
   * في حال فشل أي معالج، يرتفع الاستثناء فوراً دون ابتلاع الأخطاء.
   * 
   * @template E نوع حدث النطاق
   * @param {E} event كائن حدث النطاق المراد نشره
   * @returns {Promise<void>}
   */
  public async dispatch<E extends IDomainEvent<unknown>>(event: E): Promise<void> {
    if (!event || typeof event.eventName !== 'string' || event.eventName.trim().length === 0) {
      throw new Error('[InMemoryDomainEventDispatcher] Invalid event: eventName property is required and must be a non-empty string.');
    }

    const eventName = event.eventName;
    const registeredHandlers = this.handlersMap.get(eventName);

    if (!registeredHandlers || registeredHandlers.length === 0) {
      return;
    }

    // أخذ نسخة دفاعية من مصفوفة المعالجات لمنع التأثر بإلغاء الاشتراك أثناء التوزيع
    const snapshotHandlers = [...registeredHandlers];

    for (const handler of snapshotHandlers) {
      // إطلاق الخطأ مباشرة واستكمال مساره للطبقة الأعلى عند حدوث أي استثناء
      await handler(event as IDomainEvent<unknown>);
    }
  }

  /**
   * مسح جميع المعالجات المسجلة لحدث معين.
   * @param {string} eventName اسم الحدث
   */
  public clearHandlersForEvent(eventName: string): void {
    if (typeof eventName !== 'string' || eventName.trim().length === 0) {
      throw new Error('[InMemoryDomainEventDispatcher] Event name must be a valid non-empty string.');
    }
    this.handlersMap.delete(eventName);
  }

  /**
   * مسح كافة المعالجات المسجلة لجميع الأحداث.
   */
  public clearAllHandlers(): void {
    this.handlersMap.clear();
  }
}

