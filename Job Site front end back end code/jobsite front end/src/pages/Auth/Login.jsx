import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout 
      title="Welcome to Ethio-Career" 
      subtitle="Sign in to access your personalized career dashboard"
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
      <div className="w-full max-w-lg mx-auto">
        <LoginForm 
          onSwitchToRegister={() => navigate('/register')}
        />
      </div>
    </AuthLayout>
  );
};

export default Login;
