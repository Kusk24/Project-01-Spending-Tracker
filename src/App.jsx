import { Dashboard } from "./pages/Dashboard";
import Journal from "./pages/Journal"
import NotFoundPage from "./pages/NotFoundPage";
import { createBrowserRouter, HashRouter, RouterProvider, Routes, Route } from "react-router-dom"

// const router = createBrowserRouter([
//     { path: "/Project-01-Spending-Tracker/", element: <Dashboard /> },
//     { path: "/Project-01-Spending-Tracker/journal", element: <Journal /> },
//     { path: "/Project-01-Spending-Tracker/*", element: <NotFoundPage /> },
// ]);

function App() {
    return (
        <>
            <HashRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/journal" element={<Journal />} />
            </Routes>
            </HashRouter>
        </>
    )
}

export default App;