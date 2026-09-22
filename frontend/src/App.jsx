import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom'

import {
  BarChart3,
  LayoutDashboard,
  PlusCircle,
  Users,
  LogOut,
  Menu,
  X
} from 'lucide-react'

import { useState } from 'react'

import Landing from './pages/Landing/Landing'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'

import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import AddStudent from './pages/AddStudent'
import AddPerformance from './pages/AddPerformance'
import PerformanceList from './pages/PerformanceList'
import PerformanceDetails from './pages/PerformanceDetails'

import BrandLogo from './components/BrandLogo'

import {
  logoutUser,
  isLoggedIn
} from './services/session'


function Protected({ children }) {

  return isLoggedIn()
    ? children
    : <Navigate to="/login" replace />

}


function Layout() {

  const [mobile, setMobile] = useState(false)

  const location = useLocation()

  const navigate = useNavigate()


  const items = [

    [
      '/dashboard',
      'Dashboard',
      LayoutDashboard
    ],

    [
      '/students',
      'Students',
      Users
    ],

    [
      '/performance',
      'Performance',
      BarChart3
    ],

    [
      '/students/new',
      'Add Student',
      PlusCircle
    ],

    [
      '/performance/new',
      'Add Performance',
      BarChart3
    ]

  ]


  const title =
    items.find(
      ([to]) => location.pathname === to
    )?.[1] ||

    (
      location.pathname.startsWith(
        '/performance/'
      )
        ? 'Performance Details'
        : 'Dashboard'
    )


  const user = JSON.parse(
    localStorage.getItem('spa_user') || 'null'
  )


  const signout = () => {

    logoutUser()

    navigate(
      '/login',
      {
        replace: true
      }
    )

  }


  return (

    <div className="app-shell">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`sidebar ${
          mobile ? 'open' : ''
        }`}
      >

        <div className="brand">

          <BrandLogo
            to="/dashboard"
            compact
            dark
          />

          <button
            className="mobile-close"
            onClick={() => setMobile(false)}
            aria-label="Close navigation"
          >
            <X />
          </button>

        </div>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav>

          <p className="nav-label">
            WORKSPACE
          </p>


          {items.map(
            ([to, label, Icon]) => (

              <NavLink
                key={to}
                to={to}
                onClick={() =>
                  setMobile(false)
                }
                className={({ isActive }) =>
                  isActive
                    ? 'nav-link active'
                    : 'nav-link'
                }
              >

                <Icon size={18} />

                <span>
                  {label}
                </span>

              </NavLink>

            )
          )}

        </nav>


        {/* =================================================
            SIDEBAR FOOTER
        ================================================= */}

        <div className="sidebar-footer">

          <span className="status-dot"></span>

          System ready


          <button
            className="logout-btn"
            onClick={signout}
          >

            <LogOut size={15} />

            Sign out

          </button>

        </div>

      </aside>


      {mobile && (

        <div
          className="mobile-overlay"
          onClick={() =>
            setMobile(false)
          }
        />

      )}


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main-content">

        <header className="topbar">

          <button
            className="menu-btn"
            onClick={() =>
              setMobile(true)
            }
            aria-label="Open navigation"
          >
            <Menu />
          </button>


          {/* MOBILE BRAND */}

          <div className="mobile-topbar-brand">

            <BrandLogo
              to="/dashboard"
              compact
            />

          </div>


          {/* PAGE TITLE */}

          <div className="topbar-title">

            <span className="eyebrow">
              SMART PERFORMANCE ANALYZER
            </span>

            <h1>
              {title}
            </h1>

          </div>


          {/* USER */}

          <div className="topbar-user">

            <span className="user-avatar">

              {
                user?.fullName?.[0]
                  ?.toUpperCase() || 'U'
              }

            </span>

            <span>
              {user?.fullName || 'User'}
            </span>

          </div>

        </header>


        {/* =================================================
            PAGE ROUTES
        ================================================= */}

        <section className="page-content">

          <Routes>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/students"
              element={<Students />}
            />

            <Route
              path="/students/new"
              element={<AddStudent />}
            />

            <Route
              path="/performance"
              element={<PerformanceList />}
            />

            <Route
              path="/performance/new"
              element={<AddPerformance />}
            />

            <Route
              path="/performance/:id"
              element={<PerformanceDetails />}
            />

            <Route
              path="*"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

          </Routes>

        </section>

      </main>

    </div>

  )

}


export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/*"
          element={

            <Protected>

              <Layout />

            </Protected>

          }
        />

      </Routes>

    </BrowserRouter>

  )

}