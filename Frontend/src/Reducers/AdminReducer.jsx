import { createContext, useContext, useEffect, useReducer } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Connect to Socket.io server

const AdminContext = createContext();

//Initial state
const initialState = {
  verificationRequests: [],
  loading: true,
  error: null,
  totalUsersCount: {},
  pendingTutorRequests: [],
  tutors: [],
  students: [],

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
        students: action.payload.students
      }

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
        pendingRequests: [...action.payload],
        loading: false
      }

    case "Loading":
      return { ...state, loading: action.payload };

    case "Set_Error":
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

export const AdminProvider = ({ children }) => {

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    socket.emit("getVerificationRequests"); // Request verification data

    socket.on("verificationRequests", (data) => {
      dispatch({ type: "Set_Requests", payload: data });
    });

    socket.on("verificationUpdate", (updatedUser) => {
      dispatch({ type: "Remove_Requests", payload: updatedUser.userId });
    });

    socket.on("userCounts", (data) => {
      dispatch({ type: "Set_Total_Counts", payload: data })
    })

    socket.on("pendingRequests", (data) => {
      dispatch({ type: "Set_Pending_Tutor_Requests", payload: data.pendingRequests })
    })

    socket.on("error", (err) => {
      dispatch({ type: "Set_Error", payload: err.message });
    });
    socket.emit("getUsers")
    socket.emit("getAllRequest")

    return () => {
      socket.off("verificationRequests");
      socket.off("verificationUpdate");
      socket.off("error");
    };
  }, []);

  const verifyUser = (userId, action) => {
    if (action === "Approved") {
      socket.emit("verifyUser", { userId, isVerified: true });
    } else if (action === "Rejected") {
      socket.emit("verifyUser", { userId, isVerified: false })
    }
  };

  const assignTutors = (parentId, tutorId) => {
    socket.emit("assign-tutor", { tutorId, parentId });
  };

  return (
    <AdminContext.Provider value={{ ...state, verifyUser, assignTutors }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
