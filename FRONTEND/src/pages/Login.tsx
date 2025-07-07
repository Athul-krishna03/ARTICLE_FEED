import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { FormInput } from "@/components/common/FormInput";
import { useLogin } from "@/hooks/useAuth";
import { toast } from "@/hooks/useToast";
import { useNavigate } from "react-router-dom";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  rememberMe: Yup.boolean(),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const loginUser = useLogin();
  const navigate = useNavigate();

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await loginUser.mutateAsync(data);
      console.log("userLogin", response);

      if (response.user) {
        console.log("User Logged in");
        localStorage.setItem("user", JSON.stringify(response.user));
        navigate("/articleFeed");
        toast({
          title: "Success!",
          description: "Login successful!",
          duration: 3000,
        });
      } else {
        toast({
          title: "Error",
          description: response.data?.message || "Login failed.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error("Login error", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Failed to login.",
        variant: "destructive",
        duration: 3000,
      });
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Side - Welcome Section */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-4xl font-bold mb-4">
                <Sparkles className="w-8 h-8 text-blue-600" />
                ArticleFeed
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Welcome back to your
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  personalized{" "}
                </span>
                article feed
              </h1>
              <p className="text-gray-600 text-lg">
                Discover, read, and stay updated with content tailored just for
                you. Join thousands of readers who trust ArticleFeed for their
                daily dose of knowledge.
              </p>
            </div>
            {/* Social Proof */}
            <div className="bg-white/50 rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">50,000+</span>{" "}
                  active readers
                </div>
              </div>
              <p className="text-sm text-gray-600 italic">
                "ArticleFeed has completely transformed how I consume news and
                articles. The personalization is spot-on!"
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center m-15">
            <div className="w-full max-w-md">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Sign in to your account
                  </h2>
                  <p className="text-gray-600">
                    Enter your credentials to access your personalized feed
                  </p>
                </div>

                <div className="space-y-6">
                  <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    register={register}
                    error={errors.email}
                    required
                  />

                  <FormInput
                    label="Password"
                    name="password"
                    type="password"
                    register={register}
                    error={errors.password}
                    required
                  />

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("rememberMe")}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                  </div>

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
                        Sign In
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="text-center text-sm text-gray-600 pt-4">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                      onClick={() => navigate("/signup")}
                    >
                      Sign up here
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
