/**
 * @file AggregateRoot.ts
 * @module core/domain
 * @description الفئة المجرّدة الأساسية لجميع الجذور المجمعة (Aggregate Roots) وفق منهجية Domain-Driven Design (DDD).
 * ترث من الكيان (Entity) وتعمل كحدود معنوية لحفظ المتغيرات وتجميع وإدارة أحداث النطاق (Domain Events).
 */

import { Entity, EntityProps } from './Entity';
import { IDomainEvent } from '../events/IDomainEvent';

/**
 * الفئة المجرّدة للجذور المجمعة (Aggregate Root Base Class)
 * @template T نوع الخصائص الداخلية للكيان المجمع
 * @template ID نوع الهوية الفريدة للكيان المجمع (افتراضياً string)
 */
export abstract class AggregateRoot<T extends EntityProps, ID = string> extends Entity<T, ID> {
  private readonly _domainEvents: IDomainEvent<ID>[] = [];

  /**
   * الحصول على قائمة أحداث النطاق المسجلة للقراءة فقط والمحفوظة في الكيان المجمع ولم تُنشر بعد
   * @returns {ReadonlyArray<IDomainEvent<ID>>} قائمة أحداث النطاق الدفاعية للقراءة فقط
   */
  public get domainEvents(): ReadonlyArray<IDomainEvent<ID>> {
    return [...this._domainEvents];
  }

  /**
   * إضافة حدث نطاق جديد إلى قائمة الأحداث المنتظرة للنشر
   * @param {IDomainEvent<ID>} domainEvent حدث النطاق المراد تسجيله
   * @protected
   */
  protected addDomainEvent(domainEvent: IDomainEvent<ID>): void {
    this._domainEvents.push(domainEvent);
  }

  /**
   * مسح جميع أحداث النطاق المسجلة (تُستدعى عادة بواسطة Repository أو Event Dispatcher بعد نشر الأحداث بنجاح)
   */
  public clearDomainEvents(): void {
    this._domainEvents.length = 0;
  }
}

