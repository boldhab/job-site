import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';
import { authAPI } from "../../api/auth.api";
import { getDashboardRoute } from "../../utils/helpers";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon, 
  BuildingOfficeIcon,
  ArrowRightIcon,
  RocketLaunchIcon,
  StarIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

const RegisterForm = ({ onSwitchToLogin, onSuccess }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "JOB_SEEKER",
    fullName: "",
    companyName: "",
    phone: "",
    location: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [ethiopianRegions] = useState([
    "Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", 
    "Dire Dawa", "Gambela", "Harari", "Oromia", 
    "SNNPR", "Somali", "Tigray"
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    
    if (error) setError("");
    
    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.role === "JOB_SEEKER" && !formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (formData.role === "EMPLOYER" && !formData.companyName.trim()) {
      setError("Company name is required");
      return false;
    }
    if (!termsAccepted) {
      setError("Please accept the terms and conditions");
      return false;
    }
    return true;
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500";
    if (passwordStrength < 75) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      
      const response = await authAPI.register(registrationData);
      const token = response.data.token || response.data.accessToken;
      
      if (!token) {
        throw new Error("No authentication token received");
      }

      const userData = await login(token);
      
      if (userData?.role) {
        if (onSuccess) {
          onSuccess(userData);
        } else {
          const dashboardRoute = getDashboardRoute(userData.role);
          navigate(dashboardRoute, { replace: true });
        }
      } else {
        setError("Registration successful! Please sign in.");
        setTimeout(() => onSwitchToLogin(), 3000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || err.message 
        || "Registration failed. Please check your details.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Trust Indicator */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                id="password"
                name="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                required
                disabled={loading}
                icon={<LockClosedIcon className="w-5 h-5 text-neutral-400" />}
                className="py-3.5 px-4 rounded-2xl border-2 focus:border-amber-300 transition-all duration-300"
              />
              {formData.password && (
                <div className="mt-1 space-y-1">
                  <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Input
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter"
              required
              disabled={loading}
              icon={<LockClosedIcon className="w-5 h-5 text-neutral-400" />}
              className="py-3.5 px-4 rounded-2xl border-2 focus:border-amber-300 transition-all duration-300"
            />
          </div>
        </div>

        {/* Role Selection */}
        <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/50 rounded-2xl p-4 border-2 border-amber-100 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "JOB_SEEKER", label: "Find Jobs", icon: UserIcon },
              { value: "EMPLOYER", label: "Post Jobs", icon: BuildingOfficeIcon }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange({ target: { name: "role", value: option.value } })}
                className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 ${formData.role === option.value 
                  ? 'border-amber-400 bg-white shadow-md' 
                  : 'border-amber-100 bg-white/50 hover:bg-white'
                }`}
                disabled={loading}
              >
                <div className={`p-2 rounded-lg ${formData.role === option.value 
                  ? 'bg-amber-100 text-amber-600' 
                  : 'bg-neutral-100 text-neutral-400'
                }`}>
                  <option.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-neutral-900 text-xs">{option.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {formData.role === "JOB_SEEKER" ? (
            <Input
              id="fullName"
              name="fullName"
              label="Full Name"
              type="text"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              disabled={loading}
              icon={<UserIcon className="w-5 h-5 text-neutral-400" />}
              className="py-3.5 px-4 rounded-2xl border-2 focus:border-amber-300 transition-all duration-300"
            />
          ) : (
            <Input
              id="companyName"
              name="companyName"
              label="Company Name"
              type="text"
              autoComplete="organization"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter your company name"
              required
              disabled={loading}
              icon={<BuildingOfficeIcon className="w-5 h-5 text-neutral-400" />}
              className="py-3.5 px-4 rounded-2xl border-2 focus:border-amber-300 transition-all duration-300"
            />
          )}

          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-3.5 rounded-2xl border-2 border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-300 transition-all duration-300 bg-white text-sm"
            disabled={loading}
          >
            <option value="">Select Region</option>
            {ethiopianRegions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div className="flex items-start gap-4 p-4 bg-white/50 rounded-2xl border-2 border-amber-100 backdrop-blur-sm group hover:border-amber-300/50 transition-all duration-300">
          <input
            id="terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 w-5 h-5 text-amber-600 bg-white border-2 border-amber-200 rounded-xl focus:ring-amber-500 focus:ring-2 focus:ring-offset-0 transition-all duration-300 group-hover:border-amber-300"
            disabled={loading}
          />
          <label htmlFor="terms" className="text-xs text-neutral-700 leading-relaxed">
            I agree to the <Link to="/terms" className="font-semibold text-amber-700">Terms</Link> and <Link to="/privacy" className="font-semibold text-amber-700">Privacy Policy</Link>
          </label>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          loading={loading}
          fullWidth
          size="large"
          className="group py-4 font-bold text-base shadow-lg hover:shadow-2xl hover:shadow-amber-500/25 transform hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 border-0"
          disabled={!termsAccepted}
        >
          {loading ? "Creating Profile..." : "Join Ethio-Career"}
        </Button>

        {onSwitchToLogin && (
          <div className="pt-4 border-t-2 border-neutral-100 text-center text-sm">
            <span className="text-neutral-600">Already have an account? </span>
            <button 
              type="button"
              onClick={onSwitchToLogin}
              className="font-bold text-amber-700 hover:text-amber-800 transition-colors"
            >
              Sign In
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterForm;
