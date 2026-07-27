/**
 * @file Entity.ts
 * @module core/domain
 * @description الفئة المجرّدة الأساسية لجميع كائنات الكيانات (Domain Entities) وفق منهجية Domain-Driven Design (DDD).
 * تتميز الكيانات بأن لها هوية فريدة (Identity) تحدد شخصيتها المستقلة عبر دورة حياتها بغض النظر عن تغير خصائصها الداخلية.
 * تم تصميم هذا الكلاس ليدعم التوسع المستقبلي لإضافة أحداث النطاق (Domain Events) وإدارة دورة الحياة عبر AggregateRoot دون الحاجة لتغيير الواجهة العامة.
 */

export interface EntityProps {
  [key: string]: unknown;
}

/**
 * الفئة المجرّدة للكيانات (Entity Base Class)
 * @template T نوع الخصائص الداخلية للكيان (يجب أن يكون كائناً مجسماً وليس نوعاً بدائياً)
 * @template ID نوع الهوية الفريدة للكيان (افتراضياً string)
 */
export abstract class Entity<T extends EntityProps, ID = string> {
  protected readonly _id: ID;
  /**
   * الخصائص الداخلية للكيان (مغلفة ومحمية بمستوى protected لضمان عدم تعديل حالة الكيان إلا عبر طرق منطق الأعمال الخاصة بالكيان ذاته)
   */
  protected readonly props: T;

  /**
   * ينشئ كياناً جديداً بهوية فريدة وخصائص محددة.
   * @param {T} props الخصائص الوظيفية للكيان
   * @param {ID} id الهوية الفريدة للكيان
   */
  protected constructor(props: T, id: ID) {
    this._id = id;
    this.props = props;
  }

  /**
   * الحصول على الهوية الفريدة للكيان
   * @returns {ID} الهوية الفريدة
   */
  public get id(): ID {
    return this._id;
  }

  /**
   * التحقق من تساوي الكيان الحالي مع كيان آخر بناءً على الهوية والنوع الفعلي (Identity Equality)
   * @param {Entity<T, ID>} [object] الكيان المقارن به
   * @returns {boolean} true إذا كانت الهوية والنوع متطابقين تماماً، وإلا false
   */
  public equals(object?: Entity<T, ID>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (this.constructor !== object.constructor) {
      return false;
    }

    if (typeof this._id === 'object' && this._id !== null && 'equals' in (this._id as Record<string, unknown>)) {
      const idAsEqualityObject = this._id as unknown as { equals: (other: unknown) => boolean };
      return idAsEqualityObject.equals(object._id);
    }

    return this._id === object._id;
  }
}

