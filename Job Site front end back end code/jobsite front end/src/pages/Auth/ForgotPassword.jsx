import { useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../../api/auth.api";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [message, setMessage] = useState("");
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setStatus("loading");
      setMessage("");
  
      try {
        // API call to request password reset
        await authAPI.forgotPassword(email);
        setStatus("success");
        setMessage("If an account exists with this email, you will receive password reset instructions.");
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Failed to process request. Please try again.");
      }
    };
  
    return (
      <AuthLayout 
        title="Reset Password" 
        subtitle="Enter your email to receive reset instructions"
      >
        {status === "success" ? (
          <div className="text-center space-y-4">
             <div className="bg-green-50 text-success px-4 py-3 rounded-md text-sm font-medium">
               {message}
             </div>
             <Link to="/login">
                <Button variant="outline" fullWidth>Back to Login</Button>
             </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === "error" && (
              <div className="bg-red-50 text-error px-4 py-3 rounded-md text-sm font-medium">
                {message}
              </div>
            )}
    
            <Input
              id="email"
              label="Email address"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === "loading"}
            />
    
            <Button 
              type="submit" 
              variant="primary" 
              loading={status === "loading"}
              fullWidth
              size="medium"
            >
              Send Reset Link
            </Button>
    
            <div className="text-center text-sm">
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </AuthLayout>
    );
};
  
export default ForgotPassword;
