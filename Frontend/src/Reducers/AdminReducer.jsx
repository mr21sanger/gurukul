import { createContext, useContext, useEffect, useReducer } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("https://gurukul-learn.online"); // Connect to Socket.io server

const AdminContext = createContext();

// Initial state
const initialState = {
  verificationRequests: [],
  loading: true,
  error: null,
  totalUsersCount: {},
  pendingTutorRequests: [],
  tutors: [],
  students: [],
  complaints: [],
  admin: JSON.parse(localStorage.getItem("admin")) || null,
  activities: JSON.parse(localStorage.getItem("activities")) || [], // Store recent activities
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "Set_Requests":
      return { ...state, verificationRequests: action.payload, loading: false };

    case "Set_Total_Counts":
      return {
        ...state,
        totalUsersCount: action.payload.counts,
        tutors: action.payload.tutors,
        students: action.payload.students,
      };

    case "Remove_Requests":
      return {
        ...state,
        verificationRequests: state.verificationRequests.filter(
          (req) => req._id !== action.payload
        ),
      };

    case "Set_Pending_Tutor_Requests":
      return {
        ...state,
        pendingTutorRequests: [...action.payload],
        loading: false,
      };

    case "Loading":
      return { ...state, loading: action.payload };

    case "Set_Error":
      return { ...state, error: action.payload, loading: false };

    case "Set_Admin":
      return { ...state, admin: action.payload, loading: false };

    case "Admin_Logout":
      return { ...state, admin: null };

    case "SET_COMPLAINTS":
      return {
        ...state,
        complaints: action.payload,
      };

    case "SET_ACTIVITIES":
      return {
        ...state,
        activities: action.payload,
      };

    default:
      return state;
  }
};

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const token = localStorage.getItem("adminToken") || "";
  const baseUrl = "https://gurukul-learn.online/";


  useEffect(() => {
    socket.emit("getVerificationRequests"); // Request verification data

    socket.on("verificationRequests", (data) => {
      dispatch({ type: "Set_Requests", payload: data });
    });

    socket.on("verificationUpdate", (updatedUser) => {
      dispatch({ type: "Remove_Requests", payload: updatedUser.userId });
    });

    socket.on("userCounts", (data) => {
      dispatch({ type: "Set_Total_Counts", payload: data });
    });

    socket.on("pendingRequests", (data) => {
      dispatch({ type: "Set_Pending_Tutor_Requests", payload: data.pendingRequests });
    });

    socket.on("error", (err) => {
      dispatch({ type: "Set_Error", payload: err.message });
    });

    socket.emit("getUsers");
    socket.emit("getAllRequest");

    // Handle activity updates
    socket.on("activityUpdate", (activityData) => {
      const updatedActivities = [activityData, ...state.activities]
        .slice(0, 5); // Keep only the latest 5 activities
      localStorage.setItem("activities", JSON.stringify(updatedActivities));
      dispatch({ type: "SET_ACTIVITIES", payload: updatedActivities });
    });

    return () => {
      socket.off("verificationRequests");
      socket.off("verificationUpdate");
      socket.off("error");
      socket.off("userCounts");
      socket.off("pendingRequests");
      socket.off("activityUpdate");
    };
  }, [state.activities]);

  // Admin Login Function
  const adminLogin = async (data) => {
    dispatch({ type: "Set_Error", payload: null });
    try {
      const res = await axios.post(`${baseUrl}admin/login-as-Admin`, data);
      dispatch({ type: "Set_Admin", payload: res.data.admin });
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      return res.data;
    } catch (err) {
      dispatch({ type: "Set_Error", payload: err.response?.data?.message || "Login failed" });
      return Promise.reject(err.response?.data?.message || "Login failed");
    }
  };

  const getComplaints = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/user/complaint/get-all-complaints`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token for authentication
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        dispatch({ type: "SET_COMPLAINTS", payload: res.data.complaints });
      } else {
        dispatch({ type: "SET_ERROR", payload: res.data.message || "Failed to fetch complaints" });
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      dispatch({ type: "SET_ERROR", payload: error.response?.data?.message || "Something went wrong" });
    }
  };

  useEffect(() => {
    getComplaints();
  }, []);

  // Admin Logout Function
  const adminLogout = () => {
    dispatch({ type: "Admin_Logout" });
    localStorage.removeItem("adminToken");
  };

  const verifyUser = (userId, action) => {
    if (action === "Approved") {
      socket.emit("verifyUser", { userId, isVerified: true });
    } else if (action === "Rejected") {
      socket.emit("verifyUser", { userId, isVerified: false });
    }
  };

  const assignTutors = (parentId, tutorId) => {
    socket.emit("assign-tutor", { tutorId, parentId });
  };

  return (
    <AdminContext.Provider value={{ ...state, socket, verifyUser, assignTutors, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
