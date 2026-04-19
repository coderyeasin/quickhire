import { LoginInput, RegisterInput } from "@/modules/user/UserValidators";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FaArrowLeftLong } from "react-icons/fa6";

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigoTags/70 transition-all";

interface FieldsProps {
  register: UseFormRegister<RegisterInput | LoginInput>;
  errors: FieldErrors<RegisterInput | LoginInput>;
  isPending: boolean;
  errorMessage?: string;
  submitLabel?: string;
  pendingLabel?: string;
}

interface IRegister extends FieldsProps {
  variant: "register";
  role: "candidate" | "recruiter";
  onBack: () => void;
}

interface ILogin extends FieldsProps {
  variant: "login";
}

type UserRegister = IRegister | ILogin;

const RegisterFields = (props: UserRegister) => {
  const {
    register,
    errors,
    isPending,
    errorMessage,
    submitLabel = "Submit",
    pendingLabel = "Submitting...",
  } = props;

  const registerErrors = errors as FieldErrors<RegisterInput>;
  const loginErrors = errors as FieldErrors<LoginInput>;

  return (
    <section className="space-y-3">
      {props.variant === "register" && (
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest font-medium">
              Registering as
            </p>
            <h2 className="text-xl font-bold text-white">
              {props.role === "candidate" ? "Job Seeker" : "Recruiter"}
            </h2>
          </div>
          <button
            type="button"
            onClick={props.onBack}
            className="text-md text-white flex justify-between items-center gap-1 cursor-pointer  hover:text-indigoTags transition-colors mt-1 font-medium"
          >
            <FaArrowLeftLong />
          </button>
        </div>
      )}

      {/* server error */}
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
          <p className="text-sm text-red-400">{errorMessage}</p>
        </div>
      )}

      {/* fields */}
      {props.variant === "register" && (
        <div>
          <input
            {...register("name")}
            placeholder="Full name"
            className={inputCls}
          />
          {registerErrors.name && (
            <p className="text-red-400 text-xs mt-1">
              {registerErrors.name.message}
            </p>
          )}
        </div>
      )}
      <div>
        <input
          {...register("email")}
          placeholder="Email address"
          className={inputCls}
        />
        {loginErrors.email && (
          <p className="text-red-400 text-xs mt-1">
            {loginErrors.email.message}
          </p>
        )}
      </div>

      {props.variant === "register" && (
        <div>
          <label className="block text-xs text-white/40 mb-1.5">
            Profile photo
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            {...register("avatar")}
            className="w-full text-xs text-white/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-indigoTags/20 file:text-white/30 hover:file:text-white hover:file:bg-indigoTags/30 file:cursor-pointer cursor-pointer"
          />
          {registerErrors.avatar && (
            <p className="text-red-400 text-xs mt-1">
              {registerErrors.avatar.message as string}
            </p>
          )}
        </div>
      )}

      <div>
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className={inputCls}
        />
        {loginErrors.password && (
          <p className="text-red-400 text-xs mt-1">
            {loginErrors.password.message}
          </p>
        )}
      </div>

      {props.variant === "register" && (
        <div>
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm password"
            className={inputCls}
          />
          {registerErrors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">
              {registerErrors.confirmPassword.message}
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-indigoTags hover:bg-indigoTags/90 text-white font-semibold py-2.5 rounded-lg cursor-pointer transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
      >
        {isPending && (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {isPending ? pendingLabel : submitLabel}
      </button>
    </section>
  );
};

export default RegisterFields;
