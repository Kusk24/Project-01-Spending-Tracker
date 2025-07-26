import { Dashboard }  from "./pages/Dashboard";
import Journal from "./pages/Journal"
import NotFoundPage from "./pages/NotFoundPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom"

const router = createBrowserRouter([
    { path: "/", element: <Dashboard /> },
    { path: "/journal", element: <Journal /> },
    { path: "*", element: <NotFoundPage /> }
]);

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default App;