import { User, MapPin } from "react-feather";

const ProfileSection = ({ icon: Icon, title, children, iconColor = "blue" }) => {
  const colorClasses = {
    blue: "bg-dairy-primary/20 text-dairy-primary",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[iconColor]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ProfileSection; 