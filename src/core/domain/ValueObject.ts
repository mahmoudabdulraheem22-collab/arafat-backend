/**
 * @file ValueObject.ts
 * @module core/domain
 * @description الفئة المجرّدة الأساسية لجميع كائنات القيم (Value Objects) وفق منهجية Domain-Driven Design (DDD).
 * تمتاز كائنات القيم بأنها لا تملك هوية فريدة (No Identity)، وتعتمد في المساواة على تطابق قيم خصائصها الداخلية بالكامل (Structural Equality)،
 * كما أنها غير قابلة للتعديل المباشر بعد الإنشاء (Immutable props object).
 */

export interface ValueObjectProps {
  [key: string]: unknown;
}

/**
 * دالة مساعدة للمقارنة الهيكلية العميقة (Recursive Structural Comparison)
 * تدعم المقارنة بين: القيم الأولية (Primitives)، الكائنات العادية (Plain Objects)، المصفوفات (Arrays)، والتواريخ (Date).
 */
function isObject(item: unknown): item is Record<string, unknown> {
  return typeof item === 'object' && item !== null;
}

function structuralEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!structuralEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }

  if (isObject(a) && isObject(b)) {
    if (Array.isArray(a) !== Array.isArray(b)) {
      return false;
    }
    if (a instanceof Date !== b instanceof Date) {
      return false;
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) {
        return false;
      }
      if (!structuralEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }

  return false;
}

/**
 * الفئة المجرّدة لكائنات القيم (Value Object Base Class)
 * @template T نوع الخصائص الداخلية لكائن القيمة
 */
export abstract class ValueObject<T extends ValueObjectProps> {
  /**
   * الخصائص الداخلية لكائن القيمة (محمية وقابلة للقراءة فقط لضمان Immutability)
   */
  protected readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze({ ...props });
  }

  /**
   * التحقق من مساواة كائن قيمة آخر للكائن الحالي بناءً على القيم والخصائص الداخلية (Structural Equality)
   * @param {ValueObject<T>} [vo] كائن القيمة المراد مقارنته
   * @returns {boolean} true إذا كانت نوع الفئة وجميع الخصائص متطابقة
   */
  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (this === vo) {
      return true;
    }

    if (this.constructor !== vo.constructor) {
      return false;
    }

    if (!vo.props) {
      return false;
    }

    return structuralEqual(this.props, vo.props);
  }
}

