import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const Header = () => {
    const auth = useSelector((state) => state.auth);

    const { user, isLogged } = auth;

    const handleLogout = async () => {
        try {
            await axios.get("/user/logout");
            localStorage.removeItem("firstLogin");
            window.location.href = "/";
        } catch (error) {
            window.location.href = "/";
        }
    };

    const userLink = () => {
        return (
            <li className="drop-nav">
                <Link to="#" className="avatar">
                    <img src={user.avatar} alt="" /> {user.name}{" "}
                    <i className="fas fa-angle-down"></i>
                </Link>
                <ul className="drop-down">
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                        <Link to="/" onClick={handleLogout}>
                            Logout
                        </Link>
                    </li>
                </ul>
            </li>
        );
    };
    return (
        <header>
            <div className="logo">
                <h1 className="text-2xl font-bold">
                    <Link to="/">TunKiet</Link>
                </h1>
            </div>

            <ul>
                <li>
                    <Link to="/">
                        <i className="fas fa-comment"></i> Chat
                    </Link>
                </li>
                {isLogged ? (
                    userLink()
                ) : (
                    <li>
                        <Link to="/login">
                            <i className="fas fa-user"></i> Sign in
                        </Link>
                    </li>
                )}
            </ul>
        </header>
    );
};

export default Header;
