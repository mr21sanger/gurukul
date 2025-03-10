import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("https://gurukul-e6by.onrender.com"); // Connect to Socket.io server

const UserContext = createContext();

const initialValue = {
    loading: false,
    error: "",
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "Loading":
            return { ...state, loading: true, error: "" };
        case "SIGNUP_SUCCESS":
            return {
                ...state,
                loading: false,
                token: action.payload.token,
                error: "",
            };
        case "Set_User":
            return {
                ...state,
                loading: false,
                user: action.payload
            };
        case "SIGNUP_FAILURE":
            return { ...state, loading: false, error: action.payload };
        case "LOGOUT":
            return { ...state, user: null, token: null };

        case "SUCCESS":
            return { ...state, loading: false, error: "" }

        case "Error":
            return { ...state, error: action.payload, loading: false }
        default:
            return state;
    }
};

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialValue);
    const baseUrl = "https://gurukul-e6by.onrender.com/user";

    // DASHBOARD DATA FUNCTION
    const dashboardAccess = async (email) => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get(`${baseUrl}/dashboard?email=${email}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            dispatch({ type: "Set_User", payload: res?.data.user });
            localStorage.setItem("user", JSON.stringify(res?.data.user));
            return true;
        } catch (error) {
            console.error("Axios error", error);
        }
    };

    // SIGNUP FUNCTION
    const userSignUp = async (user) => {
        dispatch({ type: "Loading" });
        try {
            const res = await axios.post(`${baseUrl}/signup`, user);
            if (res?.data?.status) {
                const { userData, token } = res.data;
                localStorage.setItem("token", token);
                dashboardAccess(userData?.email);
                dispatch({ type: "SIGNUP_SUCCESS", payload: { token } });
            }
            return res?.data?.status;
        } catch (error) {
            dispatch({ type: "SIGNUP_FAILURE", payload: error.res?.data?.message || "Signup failed" });
        }
    };

    // POST A TUTOR REQUEST BY PARENTS
    const postTutorRequest = async (data) => {
        dispatch({ type: "Loading" });
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const res = await axios.post(`${baseUrl}/request-tutor`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return true;
            } catch (error) {
                console.error("Frontend Error", error);
            }
        }
    };

    // ADD OR EDIT THE USER DATA
    const addOrEdit = async (data) => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const res = await axios.post(`${baseUrl}/addOrEdit`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(data.type, res)
                let updatedUser = state.user;
                if (res && data.type === "subject") {
                    updatedUser = { ...state.user, subjects: res.data.subjects };
                } else if (res && data.type === "schedule") {
                    console.log("ih")
                    updatedUser = { ...state.user, schedules: res.data.schedules };
                } else if (res && data.type === "experience") {
                    updatedUser = { ...state.user, experience: res.data.experience };
                } else if (res && data.type === "qualification") {
                    updatedUser = { ...state.user, qualifications: res.data.qualifications };
                }
                localStorage.setItem("user", JSON.stringify(updatedUser));
                dispatch({ type: "Set_User", payload: updatedUser });
            } catch (error) {
                dispatch({ type: "Error", payload: error?.response?.data?.error })

            }
        }
    };


    //REMOVE DATA FUNCTION
    const removeItem = async (data) => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const res = await axios.post(`${baseUrl}/removeItem`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                let updatedUser = state.user;
                if (res && data.type === "subject") {
                    updatedUser = { ...state.user, subjects: res.data.subjects };
                } else if (res && data.type === "schedule") {
                    updatedUser = { ...state.user, schedules: res.data.schedules };
                } else if (res && data.type === "experience") {
                    updatedUser = { ...state.user, experience: res.data.experience };
                } else if (res && data.type === "qualification") {
                    updatedUser = { ...state.user, qualifications: res.data.qualifications };
                }

                localStorage.setItem("user", JSON.stringify(updatedUser));
                dispatch({ type: "Set_User", payload: updatedUser });

            } catch (error) {
                console.log(error)
                dispatch({ type: "Error", payload: error?.response?.data?.error });
            }
        }
    };



    // LOGIN FUNCTION
    const login = async (data) => {
        try {
            dispatch({ type: "Loading" });
            const res = await axios.post(`${baseUrl}/login`, data);
            if (res?.data?.status) {
                const { token } = res.data;
                localStorage.setItem("token", token);
                dashboardAccess(data?.email);
                dispatch({ type: "SIGNUP_SUCCESS", payload: { token } });
                return res?.data?.userData?.role === "Student" ? "parent-dash" : "tutor-dash";
            }
        } catch (error) {
            console.error(error);
            dispatch({ type: "Error", payload: error.response.data.error })

        }
    };


    //POST A COMPLAINT
    const postComplaint = async (data) => {
        const token = localStorage.getItem("token")
        if (token) {
            try {
                if (!data) return
                const res = await axios.post(baseUrl + `/complaint/post-a-complaint/${data?.id}`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                return true
            } catch (error) {
                dispatch({ type: "Error", payload: error.response.data.error })
            }
        }
    }

    // EDIT PROFILE
    const editProfile = async (formData) => {
        try {
            const token = localStorage.getItem("token");
            dispatch({ type: "Loading" })
            const res = await axios.put(baseUrl + "/update-profile", formData, {
                headers: { Authorization: token }
            });

            if (res?.data?.status) {
                const updatedUser = { ...state.user, userId: res.data.user };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                dispatch({ type: "Set_User", payload: updatedUser });
            }

        } catch (error) {
            dispatch({ type: "Error", payload: error.response.data.error })

        }

    }


    //CHANGE PASSWORD

    const changePassword = async (formData) => {
        try {
            const token = localStorage.getItem("token");
            dispatch({ type: "Loading" })
            const res = await axios.post(
                baseUrl + "/change-password",
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return true
        } catch (error) {
            dispatch({ type: "Error", payload: error.response.data.error })
        }
    }


    // UPLOAD DOCUMENTS FUNCTION
    const uploadDocuments = async (aadhaarFile, selfieFile, id) => {
        dispatch({ type: "Loading" });
        const token = localStorage.getItem("token");
        if (!token) return;

        const formData = new FormData();
        formData.append("aadhaar", aadhaarFile);
        formData.append("selfie", selfieFile);

        try {
            const res = await axios.put(`${baseUrl}/upload-verification/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedUser = { ...state.user, verificationStatus: res.data.verificationStatus };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            dispatch({ type: "Set_User", payload: updatedUser });
            return res.data;
        } catch (error) {
            console.error("Upload Error:", error.res?.data || error.message);
            dispatch({ type: "SIGNUP_FAILURE", payload: "Document upload failed" });
        }
    };



    //SOCKET AND REALTIME FUNCTIONS *************** 

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            dispatch({ type: "SIGNUP_SUCCESS", payload: { user: storedUser, token: storedToken } });
        }

        // SOCKET EVENTS
        socket.on("verificationUpdate", (data) => {
            console.log(data)
            if (state.user && state.user.userId._id === data.userId) {
                const updatedUser = { ...state.user, isVerified: data.isVerified, verificationStatus: data.verificationStatus };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                dispatch({ type: "Set_User", payload: updatedUser });
            }
        });
        socket.on("tutorAssigned", (data) => {
            let updatedUser;

            if (state?.user?.userId?.role === "Student") {
                updatedUser = {
                    ...state.user,
                    assigned: true,
                    tutorAssigned: {
                        tutor: data.tutorDetails,
                        status: "assigned"
                    }
                };
            } else if (state?.user?.userId?.role === "Instructor") {
                updatedUser = {
                    ...state.user,
                    assignedParents: data?.tutorUpdate,
                    assigned: true,
                };
            }

            localStorage.setItem("user", JSON.stringify(updatedUser));
            dispatch({ type: "Set_User", payload: updatedUser });
        });

        return () => {
            socket.off("verificationUpdate");
        };
    }, []);

    // LOGOUT FUNCTION
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        dispatch({ type: "LOGOUT" });
    };

    // FORGET PASSWORD
    const forgetPassword = async (email) => {
        try {
            dispatch({ type: "Loading" })
            const res = await axios.post(baseUrl + "/forgot-password", { email })
            if (res.status) {
                dispatch({ type: "SUCCESS" })
                return res.data
            }
        } catch (error) {
            console.error(error)
        }
    }

    // RESET PASSWORD
    const resetPassword = async (data) => {
        try {
            dispatch({ type: "Loading" })
            const res = await axios.post(baseUrl + "/reset-password", data)
            if (res.status) {
                dispatch({ type: "SUCCESS" })
                return true
            }
        } catch (error) {
            dispatch({ type: "Error", payload: error.response.data.error })
        }
    }

    return (
        <UserContext.Provider value={{ ...state, removeItem, changePassword, resetPassword, forgetPassword, editProfile, login, postComplaint, addOrEdit, uploadDocuments, userSignUp, postTutorRequest, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// CUSTOM HOOK
export const useUserReducer = () => {
    return useContext(UserContext);
};
