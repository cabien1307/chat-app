import axios from "axios";
import { useState } from "react";
import {
    showErrMsg,
    showSuccessMsg,
} from "../../utils/notification/Notification";
import { isEmail } from "../../utils/validation/Validation";

const initialState = {
    email: "",
    err: "",
    success: "",
};

const ForgotPassword = () => {
    const [data, setData] = useState(initialState);

    const { email, err, success } = data;

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value, err: "", success: "" });
    };

    const forgotPassword = async (e) => {
        e.preventDefault();
        if (!isEmail(email))
            return setData({ ...data, err: "Invalid emails!", success: "" });

        try {
            const res = await axios.post("/user/forgot", { email });
            return setData({ ...data, err: "", success: res.data.msg });
        } catch (error) {
            error.response.data.msg &&
                setData({ ...data, err: error.response.data.msg, success: "" });
        }
    };

    return (
        <div className="fg_pass">
            <h2>Forgot Your Password?</h2>
            <div className="row">
                {err && showErrMsg(err)}
                {success && showSuccessMsg(success)}

                <label htmlFor="email">Enter your email address</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={handleChangeInput}
                />
                <button onClick={forgotPassword}>Verify your email</button>
            </div>
        </div>
    );
};

export default ForgotPassword;
