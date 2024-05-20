import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import HighOrderComponent from "./components/hoc"
import { Context } from "./main"
import { useContext, JSX, useEffect, useState } from "react"
import { ErrorPage, LoadingPage, LoginPage, MainPage } from "./pages"

const availableRoutes = [
  {
    path: '/',
    component: MainPage,
    requiresAuth: true,
  },
  {
    path: '/login',
    component: LoginPage,
    requiresAuth: false
  }
]

function App() {
  const [authChecking, setAuthChecking] = useState(true);
  const store = useContext(Context);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    async function checkAuth() {
      await store.checkAuth();
      setAuthChecking(false); 
    }
    checkAuth();
  }, [store]);

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {

    return store.state.isLoggedIn ? children : <Navigate to="/login" />;
  };
  if (authChecking) {
    return (
      <LoadingPage />
    )
  }

  return (
    <BrowserRouter>
      <div className="App">
        <HighOrderComponent>
          <Routes>
            {availableRoutes.map(({ path, component: Component, requiresAuth }) =>
              requiresAuth ? (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ProtectedRoute>
                      <Component />
                    </ProtectedRoute>
                  }
                />
              ) : (
                <Route key={path} path={path} element={<Component />} />
              )
            )}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </HighOrderComponent>
      </div>
    </BrowserRouter>
  );

}

export default App
