import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authAPI } from "../../api/auth.api";
import { getDashboardRoute } from "../../utils/helpers";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  ArrowRightIcon, 
  StarIcon,
  ShieldCheckIcon 
} from "@heroicons/react/24/outline";

const LoginForm = ({ onSwitchToRegister, onSuccess }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login({ 
        email: formData.email, 
        password: formData.password 
      });
      
      const token = response.data.token || response.data.accessToken || response.data.access_token;
      
      if (!token) {
        throw new Error("Authentication failed: No token received");
      }

      const userData = await login(token, rememberMe);
      
      if (userData?.role) {
        if (onSuccess) {
          onSuccess(userData);
        } else {
          const dashboardRoute = getDashboardRoute(userData.role);
          navigate(dashboardRoute, { replace: true });
        }
      } else {
        throw new Error("Unable to retrieve user profile data");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || err.message 
        || "Authentication failed. Please verify your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Trust Indicator - optional, can be passed as prop or handled in parent */}
      <div className="flex items-center justify-center gap-2 mb-8 p-4 bg-gradient-to-r from-amber-50/80 to-orange-50/50 rounded-2xl border-2 border-amber-100 backdrop-blur-sm">
        <ShieldCheckIcon className="w-5 h-5 text-amber-600" />
        <span className="text-sm font-semibold text-amber-800">
          Secure Ethiopian Career Portal
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="animate-fadeIn bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6">
          <Input
            id="email"
            name="email"
            label="Email Address"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            required
            disabled={loading}
            icon={<EnvelopeIcon className="w-5 h-5 text-neutral-400" />}
            className="py-3.5 px-4 rounded-2xl border-2 focus:border-amber-300 transition-all duration-300"
          />

          <div className="space-y-4">
            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading}
              icon={<LockClosedIcon className="w-5 h-5 text-neutral-400" />}
              className="py-3.5 px-4 rounded-2xl border-2 focus:border-amber-300 transition-all duration-300"
            />
            
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 text-amber-600 bg-white border-2 border-amber-200 rounded-xl focus:ring-amber-500 focus:ring-2 focus:ring-offset-0 transition-all duration-300 group-hover:border-amber-300"
                  disabled={loading}
                />
                <span className="ml-3 text-sm font-medium text-neutral-700 group-hover:text-neutral-800 transition-colors">
                  Remember me
                </span>
              </label>
              
              <Link 
                to="/forgot-password" 
                className="text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors duration-200 inline-flex items-center gap-1 group"
              >
                Forgot password?
                <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          loading={loading}
          fullWidth
          size="large"
          className="group py-4 font-bold text-base shadow-lg hover:shadow-2xl hover:shadow-amber-500/25 transform hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 border-0"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <StarIcon className="w-5 h-5 animate-spin" />
              Signing in...
            </span>
          ) : (
            <>
              Sign In to Ethio-Career
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </>
          )}
        </Button>

        {onSwitchToRegister && (
          <div className="pt-6 border-t-2 border-neutral-100 text-center">
            <p className="text-neutral-600 text-sm mb-2">
              New to Ethio-Career?
            </p>
            <button 
              type="button"
              onClick={onSwitchToRegister}
              className="inline-flex items-center gap-2 font-semibold text-amber-700 hover:text-amber-800 transition-colors duration-200 group"
            >
              <span className="px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl border border-amber-200 group-hover:border-amber-300 transition-all duration-300">
                Create Ethiopian Career Profile
              </span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
