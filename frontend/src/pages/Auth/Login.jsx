import { loginUser } from "../../services/authServices";
import { saveSession } from "../../services/session";
import { useState } from "react";
import BrandLogo from '../../components/BrandLogo'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  BarChart3,
  Brain,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

function Login() {
  // =========================================================
  // NAVIGATION
  // =========================================================

  const navigate = useNavigate();

  // =========================================================
  // FORM STATE
  // =========================================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // =========================================================
  // UI STATE
  // =========================================================

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
      submit: "",
    }));
  };

  // =========================================================
  // FORM VALIDATION
  // =========================================================

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email = "Enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================================================
  // HANDLE LOGIN
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Stop if frontend validation fails
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      setErrors({});

      // =====================================================
      // LOGIN API
      // =====================================================

      const response = await loginUser({
        email: formData.email
          .trim()
          .toLowerCase(),

        password: formData.password,
      });

      console.log("Login successful:", response);

      // =====================================================
      // SAVE AUTHENTICATION SESSION
      // =====================================================

      saveSession(response);

      // =====================================================
      // SUCCESS ALERT
      // =====================================================

      window.alert(
        "Login successful!\n\nWelcome to SP Smart Performance."
      );

      // =====================================================
      // NAVIGATE TO DASHBOARD
      // =====================================================
      // Navigation happens ONLY after the user clicks OK
      // on the alert.
      // =====================================================

      navigate("/dashboard", {
        replace: true,
      });

    } catch (error) {
      console.error("Login failed:", error);

      const responseData = error.response?.data;

      console.log(
        "Backend response:",
        responseData
      );

      // =====================================================
      // BACKEND VALIDATION ERRORS
      // =====================================================

      const backendErrors =
        responseData?.validationErrors || {};

      setErrors({
        ...backendErrors,

        submit:
          responseData?.message ||
          "Invalid email or password. Please try again.",
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="auth-page">

      {/* =====================================================
          LEFT BRAND PANEL
      ====================================================== */}

      <div className="auth-brand-panel">

        <div className="auth-brand-content">

          {/* LOGO */}

          <BrandLogo
             to="/"
             dark
                 />


          {/* BRAND MAIN CONTENT */}

          <div className="auth-brand-main">

            {/* BADGE */}

            <div className="auth-badge">

              <Sparkles size={15} />

              AI-Powered Student Analytics

            </div>


            {/* HEADING */}

            <h1>

              Smarter insights.
              <br />

              <span>
                Better performance.
              </span>

              <br />

              Better outcomes.

            </h1>


            {/* DESCRIPTION */}

            <p>

              Sign in to monitor student performance,
              identify learning risks and generate
              AI-powered recommendations.

            </p>


            {/* FEATURES */}

            <div className="auth-features">

              {/* FEATURE 1 */}

              <div className="auth-feature">

                <div className="auth-feature-icon">

                  <BarChart3 size={19} />

                </div>

                <div>

                  <h4>
                    Performance Analytics
                  </h4>

                  <p>
                    Track student performance
                    with meaningful insights.
                  </p>

                </div>

              </div>


              {/* FEATURE 2 */}

              <div className="auth-feature">

                <div className="auth-feature-icon">

                  <Brain size={19} />

                </div>

                <div>

                  <h4>
                    AI-Powered Insights
                  </h4>

                  <p>
                    Identify patterns and generate
                    intelligent recommendations.
                  </p>

                </div>

              </div>


              {/* FEATURE 3 */}

              <div className="auth-feature">

                <div className="auth-feature-icon">

                  <ShieldCheck size={19} />

                </div>

                <div>

                  <h4>
                    Secure & Reliable
                  </h4>

                  <p>
                    Your student analytics stay
                    protected.
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* FOOTER */}

          <div className="auth-brand-footer">

           © 2026 Smart Performance Analyzer
          </div>

        </div>

      </div>


      {/* =====================================================
          RIGHT FORM PANEL
      ====================================================== */}

      <div className="auth-form-panel">

        <div className="auth-form-container">


          {/* MOBILE LOGO */}

         <div className="mobile-auth-logo">

       <BrandLogo
        to="/"
         />

        </div>


          {/* =================================================
              HEADING
          ================================================== */}

          <div className="auth-heading">

            <h2>
              Welcome back
            </h2>

            <p>
              Sign in to continue to your
              performance dashboard.
            </p>

          </div>


          {/* =================================================
              LOGIN FORM
          ================================================== */}

          <form onSubmit={handleSubmit}>


            {/* =================================================
                GLOBAL ERROR
            ================================================== */}

            {errors.submit && (

              <div className="error-message">

                {errors.submit}

              </div>

            )}


            {/* =================================================
                EMAIL
            ================================================== */}

            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>


              <div className="input-wrapper">

                <Mail size={18} />


                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="email"
                />

              </div>


              {errors.email && (

                <span className="form-error">

                  {errors.email}

                </span>

              )}

            </div>


            {/* =================================================
                PASSWORD
            ================================================== */}

            <div className="form-group">

              <div className="password-label-row">

                <label htmlFor="password">
                  Password
                </label>


                <Link
                  to="/forgot-password"
                  className="forgot-password-link"
                >
                  Forgot Password?
                </Link>

              </div>


              <div className="input-wrapper">

                <Lock size={18} />


                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />


                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  disabled={isSubmitting}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (

                    <EyeOff size={18} />

                  ) : (

                    <Eye size={18} />

                  )}

                </button>

              </div>


              {errors.password && (

                <span className="form-error">

                  {errors.password}

                </span>

              )}

            </div>


            {/* =================================================
                REMEMBER ME
            ================================================== */}

            <div className="remember-container">

              <label className="remember-label">

                <input
                  type="checkbox"
                  name="rememberMe"
                  disabled={isSubmitting}
                />

                <span>
                  Remember me
                </span>

              </label>

            </div>


            {/* =================================================
                LOGIN BUTTON
            ================================================== */}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isSubmitting}
            >

              {isSubmitting ? (

                <>
                  <span className="button-spinner" />

                  Signing In...
                </>

              ) : (

                <>
                  Sign In

                  <ArrowRight size={18} />

                </>

              )}

            </button>


            {/* =================================================
                DIVIDER
            ================================================== */}

            <div className="auth-divider">

              <span>
                or continue with
              </span>

            </div>


            {/* =================================================
                GOOGLE LOGIN
            ================================================== */}

           {/* <button
              type="button"
              className="google-btn"
              onClick={() =>
                console.log(
                  "Google login clicked"
                )
              }
              disabled={isSubmitting}
            >

              <span className="google-icon">
                G
              </span>

              Continue with Google

            </button>*/}


            {/* =================================================
                SIGNUP
            ================================================== */}

            <div className="auth-switch">

              Don't have an account?

              <Link to="/signup">
                Create Account
              </Link>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;

