import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import HighOrderComponent from "./components/hoc"
import { Context } from "./main"
import { useContext, JSX, useEffect, useState } from "react"
import { availableRoutes } from "./constants/routes"
import { ErrorPage, LoadingPage } from "./pages"

function App() {
  const [authChecking, setAuthChecking] = useState(true);
  const store = useContext(Context);


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
