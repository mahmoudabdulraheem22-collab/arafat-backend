/**
 * @file Result.ts
 * @module core/domain
 * @description كلاس ينفذ نمط Result Pattern لإدارة مخرجات العمليات وتفادي استخدام الاستثناءات (Exceptions) في التعبير عن فشل منطق الأعمال (Business Failures)، مع السماح بالاستثناءات فقط عند الاستخدام الخاطئ للواجهة البرمجية (Programmer Misuse).
 */

/**
 * كلاس معالجة النتائج (Result Pattern)
 * @template T نوع البيانات المرجعة في حالة النجاح
 * @template E نوع البيانات أو رسالة الخطأ في حالة الفشل
 */
export class Result<T = void, E = string> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  private readonly _value?: T;
  private readonly _error?: E;

  private constructor(isSuccess: boolean, error?: E, value?: T) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this._value = value;
    this._error = error;

    Object.freeze(this);
  }

  /**
   * الحصول على قيمة النجاح (يُرفع استثناء فقط عند الاستخدام الخاطئ مثل استدعاء الدالة على نتيجة فاشلة)
   * @returns {T} القيمة الناتجة عند النجاح
   * @throws {Error} عند سوء استخدام الواجهة بالوصول لقيمة نتيجة فاشلة (Programmer Misuse)
   */
  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error("InvalidOperationAccess: Cannot retrieve value from a failed result.");
    }
    return this._value as T;
  }

  /**
   * الحصول على القيمة أو قيمة افتراضية بديلة في حالة الفشل دون رفع أي استثناء
   * @param {T} defaultValue القيمة الافتراضية المرجعة عند الفشل
   * @returns {T} القيمة الفعلية أو القيمة الافتراضية
   */
  public getValueOrDefault(defaultValue: T): T {
    return this.isSuccess ? (this._value as T) : defaultValue;
  }

  /**
   * الحصول على القيمة المرجعة عند النجاح، أو null عند الفشل بدون رفع أي استثناء
   * @returns {T | null} القيمة المرجعة عند النجاح، أو null في حالة الفشل
   */
  public getOrNull(): T | null {
    return this.isSuccess ? (this._value !== undefined ? this._value : null) : null;
  }

  /**
   * الحصول على تفاصيل الخطأ (يُرفع استثناء فقط عند سوء استخدام الواجهة البرمجية)
   * @returns {E} تفاصيل الخطأ
   * @throws {Error} عند سوء استخدام الواجهة بالوصول لخطأ في نتيجة ناجحة (Programmer Misuse)
   */
  public get errorValue(): E {
    if (this.isSuccess) {
      throw new Error("InvalidOperationAccess: Cannot retrieve error from a successful result.");
    }
    return this._error as E;
  }

  /**
   * إنشاء نتيجة ناجحة
   * @template U نوع البيانات المرجعة
   * @template F نوع تفاصيل الخطأ
   * @param {U} [value] القيمة المرجعة عند النجاح
   * @returns {Result<U, F>} كائن نتيجة ناجحة
   */
  public static ok<U = void, F = string>(value?: U): Result<U, F> {
    return new Result<U, F>(true, undefined, value);
  }

  /**
   * إنشاء نتيجة فاشلة
   * @template U نوع البيانات المرجعة
   * @template F نوع تفاصيل الخطأ
   * @param {F} error تفاصيل الخطأ
   * @returns {Result<U, F>} كائن نتيجة فاشلة
   */
  public static fail<U = void, F = string>(error: F): Result<U, F> {
    return new Result<U, F>(false, error, undefined);
  }

  /**
   * تجميع مصفوفة من النتائج في نتيجة واحدة مجمعة تحفظ الأنواع (تكون ناجحة وتحتوي على مصفوفة القيم فقط إذا نجحت جميع النتائج)
   * @template U نوع البيانات لكل نتيجة
   * @template F نوع الخطأ
   * @param {Result<U, F>[]} results مصفوفة نتائج
   * @returns {Result<U[], F>} نتيجة مجمعة تحتفظ بالأنواع بدون فقدان التنميط
   */
  public static combine<U, F = string>(results: Result<U, F>[]): Result<U[], F> {
    const values: U[] = [];
    for (const result of results) {
      if (result.isFailure) {
        return Result.fail<U[], F>(result.errorValue);
      }
      values.push(result.getValue());
    }
    return Result.ok<U[], F>(values);
  }

  /**
   * تنفيذ دالة مطابقة الأنماط (Fold / Pattern Matching) للتعامل الصريح والآمن مع حالتي النجاح أو الفشل
   * @template R نوع القيمة المرجعة النهائية
   * @param {(value: T) => R} onSuccess دالة تنفذ في حالة النجاح
   * @param {(error: E) => R} onFailure دالة تنفذ في حالة الفشل
   * @returns {R} النتيجة النهائية المحولة
   */
  public fold<R>(onSuccess: (value: T) => R, onFailure: (error: E) => R): R {
    if (this.isSuccess) {
      return onSuccess(this._value as T);
    }
    return onFailure(this._error as E);
  }
}

