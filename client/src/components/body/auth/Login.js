import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import {
    showErrMsg,
    showSuccessMsg,
} from "../../utils/notification/Notification";
import { dispatchLogin } from "../../../redux/actions/authAction";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";

const initialState = {
    email: "",
    password: "",
    err: "",
    success: "",
};

const Login = () => {
    const [user, setUser] = useState(initialState);
    const dispatch = useDispatch();
    const history = useHistory();

    const { email, password, err, success } = user;

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value, err: "", success: "" });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/user/login", { email, password });
            setUser({ ...user, err: "", success: res.data.msg });

            localStorage.setItem("firstLogin", true);

            dispatch(dispatchLogin());
            history.push("/");
        } catch (error) {
            error.response.data.msg &&
                setUser({ ...user, err: error.response.data.msg, success: "" });
        }
    };

    const responseGoogle = async (response) => {
        try {
            const res = await axios.post("/user/google_login", {
                tokenId: response.tokenId,
            });

            setUser({ ...user, err: "", success: res.data.msg });
            localStorage.setItem("firstLogin", true);

            dispatch(dispatchLogin());
            history.push("/");
        } catch (error) {
            error.response.data.msg &&
                setUser({ ...user, err: error.response.data.msg, success: "" });
        }
    };

    const responseFacebook = async (response) => {
        try {
            const { accessToken, userID } = response;
            const res = await axios.post("/user/facebook_login", {
                accessToken,
                userID,
            });

            setUser({ ...user, err: "", success: res.data.msg });
            localStorage.setItem("firstLogin", true);

            dispatch(dispatchLogin());
            history.push("/");
        } catch (error) {
            error.response.data.msg &&
                setUser({ ...user, err: error.response.data.msg, success: "" });
        }
    };

    return (
        <div className="login_page">
            <h2>Login</h2>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="text"
                        placeholder="Enter email address"
                        id="email"
                        value={email}
                        name="email"
                        onChange={handleChangeInput}
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        id="password"
                        value={password}
                        name="password"
                        onChange={handleChangeInput}
                    />
                </div>

                <div className="row">
                    <button type="submit">Login</button>
                    <Link to="/forgot_password">Forgot your password?</Link>
                </div>
            </form>

            <div className="hr">Or Login With</div>

            <div className="social">
                <GoogleLogin
                    clientId="701019100399-ni5bt8ra0kd257fv44luubgrn36dfs53.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={"single_host_origin"}
                />

                <FacebookLogin
                    appId="576683856972742"
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={responseFacebook}
                />
            </div>
            <p>
                New Customer?<Link to="/register"> Register</Link>
            </p>
        </div>
    );
};

export default Login;
