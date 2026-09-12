import { inputCls, labelCls, errorCls } from "@/shared/ApplyForm";
import { BaseFieldProps } from "@/types/interfaces";

export const JobInput = ({
  label,
  name,
  register,
  errors,
  rules,
  placeholder,
  type = "text",
}: BaseFieldProps & { type?: string }) => (
  <div>
    <label className={labelCls}>{label}</label>
    <input
      type={type}
      {...register(name, rules)}
      placeholder={placeholder}
      className={inputCls}
    />
    {errors[name] && (
      <p className={errorCls}>{errors[name]?.message as string}</p>
    )}
  </div>
);

export const JobTextarea = ({
  label,
  name,
  register,
  errors,
  rules,
  placeholder,
  rows = 5,
}: BaseFieldProps & { rows?: number }) => (
  <div>
    <label className={labelCls}>{label}</label>
    <textarea
      {...register(name, rules)}
      rows={rows}
      placeholder={placeholder}
      className={`${inputCls} resize-none`}
    />
    {errors[name] && (
      <p className={errorCls}>{errors[name]?.message as string}</p>
    )}
  </div>
);

export const JobSelect = ({
  label,
  name,
  register,
  options,
}: Omit<BaseFieldProps, "errors"> & {
  options: { value: string; label: string }[];
}) => (
  <div>
    <label className={labelCls}>{label}</label>
    <select {...register(name)} className={inputCls}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
