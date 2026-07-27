/**
 * @file IRepository.ts
 * @module core/domain
 * @description العقد الأساسي لمستودعات البيانات الخاصة بالمجاميع (Aggregate Repository Base Contract).
 * يحدد العمليات الأساسية لدورة حياة الكيان المجمع (Aggregate Root) دون تضمين استعلامات عامة أو تفاصيل قواعد البيانات.
 * 
 * ملاحظات التوثيق المعماري:
 * - يُعد IRepository عقداً أساسياً اختيارياً لتحديد القواعد المشتركة بين المستودعات.
 * - يجب أن تعتمد حالات الاستخدام (Use Cases / Application Services) على عقود المستودعات المتخصصة للمجال (Domain-specific Repositories) وليس IRepository العام مباشرة.
 * - جميع عمليات الاستعلام المتخصصة والحذف تحافظ على وجودها داخل العقود الخاصة بكل مجال.
 */

import { AggregateRoot } from './AggregateRoot';
import { EntityProps } from './Entity';

/**
 * الواجهة الأساسية لمستودعات الجذور المجمعة (Aggregate Root Repository Interface)
 * @template TProps نوع خصائص الكيان المجمع
 * @template TAggregate نوع الكيان المجمع المراد إدارته
 * @template ID نوع الهوية الفريدة للكيان المجمع (افتراضياً string)
 */
export interface IRepository<
  TProps extends EntityProps,
  TAggregate extends AggregateRoot<TProps, ID>,
  ID = string
> {
  /**
   * استرجاع الكيان المجمع باستخدام معرفه الفريد
   * @param {ID} id الهوية الفريدة للكيان المجمع
   * @returns {Promise<TAggregate | null>} كائن الكيان المجمع أو null في حال عدم وجوده
   */
  findById(id: ID): Promise<TAggregate | null>;

  /**
   * حفظ أو تحديث الكيان المجمع في المستودع
   * @param {TAggregate} aggregate الكيان المجمع المراد حفظه
   * @returns {Promise<void>}
   */
  save(aggregate: TAggregate): Promise<void>;
}

