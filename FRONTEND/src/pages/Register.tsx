import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "@/components/common/FormInput";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { type User } from "@/types/user.types";
import { Sparkles, ArrowRight } from "lucide-react";
import { useRegister } from "@/hooks/useAuth";
import type { Category } from "@/types/category.types";
import { getCategories } from "@/services/api";
import { toast } from "@/hooks/useToast";
import { useNavigate } from "react-router-dom";

const schema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  phone: Yup.string().required("Phone is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  dob: Yup.string().required("Date of birth is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
  preferences: Yup.array().min(1, "Select at least one category").required(),
});

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const registerUser = useRegister();

  const watchedPreferences = watch("preferences", []);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryData = await getCategories();
      setCategories(categoryData);
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: User) => {
    setIsLoading(true);
    try {
      const response = await registerUser.mutateAsync(data);
      console.log("Registration data:", response);
      toast({
        title: "Success",
        description: "Account created successfully! 🎉",
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-4xl font-bold mb-2">
            <Sparkles className="w-8 h-8 text-blue-600" />
            ArticleFeed
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Create your account
          </h2>
          <p className="text-gray-600">
            Join thousands of readers and discover personalized content
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="First Name"
                name="firstName"
                type="text"
                register={register}
                error={errors.firstName}
                required
              />
              <FormInput
                label="Last Name"
                name="lastName"
                type="text"
                register={register}
                error={errors.lastName}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Email"
                name="email"
                type="email"
                register={register}
                error={errors.email}
                required
              />
              <FormInput
                label="Phone"
                name="phone"
                type="text"
                register={register}
                error={errors.phone}
                required
              />
            </div>

            <FormInput
              label="Date of Birth"
              name="dob"
              type="date"
              register={register}
              error={errors.dob}
              required
            />

            {/* Password Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Password"
                name="password"
                type="password"
                register={register}
                error={errors.password}
                required
              />
              <FormInput
                label="Confirm Password"
                name="passwordConfirmation"
                type="password"
                register={register}
                error={errors.passwordConfirmation}
                required
              />
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Content Preferences <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  Choose topics you're interested in to personalize your feed
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories &&
                    categories.map((category: Category) => (
                      <label
                        key={category._id}
                        className={`group relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          Array.isArray(watchedPreferences) &&
                          watchedPreferences?.includes(category._id)
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                            : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={category._id}
                          {...register("preferences")}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium text-center">
                          {category.name}
                        </span>
                        {Array.isArray(watchedPreferences) &&
                          watchedPreferences?.includes(category._id) && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                          )}
                      </label>
                    ))}
                </div>
                {errors.preferences && (
                  <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.preferences.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit(onSubmit)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Footer */}
            <div className="text-center text-sm text-gray-600 pt-4">
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                onClick={() => navigate("/login")}
              >
                Sign in here
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
