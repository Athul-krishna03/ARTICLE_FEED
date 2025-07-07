import { logoutUser } from "@/services/api";
import { getCurrentUser } from "@/utils/helpers/getCurrentUser.helper";
import { ChevronDown, FileText, LogOut, Settings, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const user = getCurrentUser();
    const menuItems = [
        { icon: Settings, label: "Settings", action: "settings" },
        { icon: FileText, label: "My Articles", action: "articles" },
        { icon: LogOut, label: "Logout", action: "logout" },
    ];
    const navigate = useNavigate()
    const onMenuAction = (action: string) => {
            switch (action) {
            case "settings":
                navigate('/settings');
                break;
            case "articles":
                navigate('/myArticles');
                break;
            case "logout":
                handleLogout();
                break;
            default:
                break;
        }
    };
    const handleLogout = async () => {
        try {
            await logoutUser();
            localStorage.removeItem("user");
            navigate("/login");
        } catch (error) {
            console.error(error);
            localStorage.removeItem("user");
            navigate("/login");
        }
    };
    return (
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-2xl font-bold">
                <Sparkles className="w-6 h-6 text-blue-600 inline mr-2" />
                ArticleFeed
                </div>
            </div>

            {/* User Menu */}
            <div className="relative">
                <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-200"
                >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                </div>
                <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                    }`}
                />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    {menuItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => {
                        onMenuAction(item.action);
                        setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                        <item.icon className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{item.label}</span>
                    </button>
                    ))}
                </div>
                )}
            </div>
            </div>
        </div>
        </header>
    );
};

export default Header;