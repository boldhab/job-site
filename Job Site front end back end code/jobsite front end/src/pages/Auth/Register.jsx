import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";

const Register = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout 
      title="Join Ethio-Career" 
      subtitle="Create your account to elevate your Ethiopian career journey"
      logo={
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-2xl border border-amber-200/50 mb-3">
            <RocketLaunchIcon className="w-5 h-5 text-amber-600" />
            <span className="text-amber-800 font-bold text-lg tracking-wide">ETHIO-CAREER</span>
          </div>
          <p className="text-sm text-neutral-600 font-medium">
            Elevate Your Ethiopian Career
          </p>
        </div>
      }
    >
      <div className="w-full max-w-md mx-auto">
        <RegisterForm 
          onSwitchToLogin={() => navigate('/login')}
        />
      </div>
    </AuthLayout>
  );
};

export default Register;
