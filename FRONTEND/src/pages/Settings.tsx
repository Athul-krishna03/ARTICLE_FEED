import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { type User } from "@/types/user.types";
import { Edit3, Save, X, Eye, EyeOff, Lock } from "lucide-react";
import type { Category } from "@/types/category.types";
import { getCategories, updateProfile } from "@/services/api";
import { toast } from "@/hooks/useToast";
import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import { getCurrentUser } from "@/utils/helpers/getCurrentUser.helper";

const profileSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    phone: Yup.string().required("Phone is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    dob: Yup.string().required("Date of birth is required"),
    preferences: Yup.array().min(1, "Select at least one category").required(),
});

const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Password confirmation is required"),
});

interface ProfileEditProps {
    user?: User;
    onUpdateProfile?: (data: User) => Promise<void>;
    onUpdatePassword?: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
}

export default function ProfileEdit({  
    onUpdatePassword 
}: ProfileEditProps) {
    const user=getCurrentUser()
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const initialValues = {
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: user?.phone || "",
        email: user?.email || "",
        dob: user?.dob || "",
        preferences: user?.preferences || [],
    };

    const passwordInitialValues = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    };

    useEffect(() => {
        const fetchCategories = async () => {
        try {
            const categoryData = await getCategories();
            setCategories(categoryData);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
        };
        fetchCategories();
    }, []);

    const handleProfileSubmit = async (values: typeof initialValues) => {
        setIsProfileLoading(true);
        try {
        const response=await updateProfile?.(values as User);
        console.log(response)
        localStorage.setItem('user',JSON.stringify(response.data))
        toast({
            title: "Success",
            description: "Profile updated successfully! ✨",
        });
        setIsEditing(false);
        } catch (error) {
        console.error("Profile update error:", error);
        toast({
            title: "Error",
            description: "Failed to update profile. Please try again.",
            variant: "destructive",
        });
        } finally {
        setIsProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (values: typeof passwordInitialValues, { resetForm }: any) => {
        setIsPasswordLoading(true);
        try {
        await onUpdatePassword?.({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
        });
        toast({
            title: "Success",
            description: "Password updated successfully! 🔒",
        });
        resetForm();
        setShowPasswordSection(false);
        } catch (error) {
        console.error("Password update error:", error);
        toast({
            title: "Error",
            description: "Failed to update password. Please check your current password.",
            variant: "destructive",
        });
        } finally {
        setIsPasswordLoading(false);
        }
    };

    const getCategoryName = (categoryId: string) => {
        const category = categories.find(cat => cat._id === categoryId);
        return category?.name || categoryId;
    };

    const DisplayField = ({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) => (
        <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
            {children || value || "Not specified"}
        </div>
        </div>
    );

    const EditableField = ({ label, name, type = "text", required = false, disabled = false }: { 
        label: string; 
        name: string; 
        type?: string; 
        required?: boolean;
        disabled?: boolean;
    }) => (
        <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <Field
            name={name}
            type={type}
            disabled={disabled}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
        </div>
    );

    const PasswordField = ({ label, name, show, onToggle }: { 
        label: string; 
        name: string; 
        show: boolean; 
        onToggle: () => void; 
    }) => (
        <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
            {label} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
            <Field
            name={name}
            type={show ? "text" : "password"}
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
            {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
        </div>
        <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
            <Header/>
            <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {isEditing ? "Edit Profile" : "Your Profile"}
            </h2>
            <p className="text-gray-600">
                {isEditing ? "Update your information and preferences" : "View and manage your account"}
            </p>
            </div>

            {/* Profile Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Profile Information</h3>
                <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                {isEditing ? (
                    <>
                    <X className="w-4 h-4" />
                    Cancel
                    </>
                ) : (
                    <>
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                    </>
                )}
                </button>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={profileSchema}
                onSubmit={handleProfileSubmit}
                enableReinitialize={true}
            >
                {({ values }) => (
                <Form className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isEditing ? (
                        <>
                        <EditableField label="First Name" name="firstName" required />
                        <EditableField label="Last Name" name="lastName" required />
                        </>
                    ) : (
                        <>
                        <DisplayField label="First Name" value={values.firstName} />
                        <DisplayField label="Last Name" value={values.lastName} />
                        </>
                    )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isEditing ? (
                        <>
                        <EditableField label="Email" name="email" type="email" required />
                        <EditableField label="Phone" name="phone" required />
                        </>
                    ) : (
                        <>
                        <DisplayField label="Email" value={values.email} />
                        <DisplayField label="Phone" value={values.phone} />
                        </>
                    )}
                    </div>

                    {isEditing ? (
                    <EditableField label="Date of Birth" name="dob" type="date" required />
                    ) : (
                    <DisplayField label="Date of Birth" value={new Date(values.dob).toISOString().split("T")[0]} />
                    )}

                    {/* Preferences */}
                    <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Content Preferences {isEditing && <span className="text-red-500">*</span>}
                    </label>
                    {isEditing ? (
                        <>
                        <p className="text-sm text-gray-600">
                            Choose topics you're interested in to personalize your feed
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {categories.map((category: Category) => (
                            <label
                                key={category._id}
                                className={`group relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                Array.isArray(values.preferences) &&
                                values.preferences?.includes(category._id)
                                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                                }`}
                            >
                                <Field
                                type="checkbox"
                                name="preferences"
                                value={category._id}
                                className="sr-only"
                                />
                                <span className="text-sm font-medium text-center">
                                {category.name}
                                </span>
                                {Array.isArray(values.preferences) &&
                                values.preferences?.includes(category._id) && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                                )}
                            </label>
                            ))}
                        </div>
                        <ErrorMessage name="preferences" component="div" className="text-red-500 text-sm" />
                        </>
                    ) : (
                        <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex flex-wrap gap-2">
                            {Array.isArray(values.preferences) && values.preferences.length > 0 ? (
                            values.preferences.map((prefId: string) => (
                                <span
                                key={prefId}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                >
                                {getCategoryName(prefId)}
                                </span>
                            ))
                            ) : (
                            <span className="text-gray-500">No preferences selected</span>
                            )}
                        </div>
                        </div>
                    )}
                    </div>

                    {/* Save Button (only visible when editing) */}
                    {isEditing && (
                    <button
                        type="submit"
                        disabled={isProfileLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isProfileLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Changes
                        </>
                        )}
                    </button>
                    )}
                </Form>
                )}
            </Formik>
            </div>

            {/* Password Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Password & Security
                </h3>
                <button
                type="button"
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                {showPasswordSection ? "Cancel" : "Change Password"}
                </button>
            </div>

            {showPasswordSection && (
                <Formik
                initialValues={passwordInitialValues}
                validationSchema={passwordSchema}
                onSubmit={handlePasswordSubmit}
                >
                <Form className="space-y-6 pt-4 border-t border-gray-200">
                    <PasswordField
                    label="Current Password"
                    name="currentPassword"
                    show={showCurrentPassword}
                    onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
                    />

                    <PasswordField
                    label="New Password"
                    name="newPassword"
                    show={showNewPassword}
                    onToggle={() => setShowNewPassword(!showNewPassword)}
                    />

                    <PasswordField
                    label="Confirm New Password"
                    name="confirmPassword"
                    show={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                    />

                    <button
                    type="submit"
                    disabled={isPasswordLoading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:transform-none"
                    >
                    {isPasswordLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                        <Lock className="w-5 h-5" />
                        Update Password
                        </>
                    )}
                    </button>
                </Form>
                </Formik>
            )}
            </div>

            {/* Back to Dashboard */}
            <div className="text-center mt-6">
            <button
                type="button"
                className="text-gray-600 hover:text-gray-800 font-medium hover:underline"
                onClick={() => navigate("/articleFeed")}
            >
                ← Back to Dashboard
            </button>
            </div>
        </div>
        </div>
    );
}