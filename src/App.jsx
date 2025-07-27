import { Dashboard }  from "./pages/Dashboard";
import Journal from "./pages/Journal"
import NotFoundPage from "./pages/NotFoundPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom"

const router = createBrowserRouter([
    { path: "/Project-01-Spending-Tracker/", element: <Dashboard /> },
    { path: "/Project-01-Spending-Tracker/journal", element: <Journal /> },
    { path: "/Project-01-Spending-Tracker/*", element: <NotFoundPage /> },
]);

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default App;