import {Link} from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <h1 className="dashboard-title">Not Found Page ❌</h1>
            <p style={{ color: '#478CC9', fontSize: '1.2rem', marginBottom: '2rem', textAlign: 'center' }}>Sorry, the page you're looking for doesn't exist.</p>
            <Link to={"/Project-01-Spending-Tracker/"}>
                <button className="submit-button">Go Back Home</button>
            </Link>
        </div>
    )
}

export default NotFoundPage;