import { motion, AnimatePresence } from "framer-motion";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";


const LoginModal = ({ open, onClose }) => {
  const dispatch = useDispatch()
    const handleGoogleAuth = async()=>{
        try{
            const result = await signInWithPopup(auth, provider);
            const {data} = await axios.post(`${serverUrl}/api/auth/google`,{
                name: result.user.displayName,
                email: result.user.email,
                avatar: result.user.photoURL
            },{
                withCredentials: true
            });
            dispatch(setUserData(data.user))
            onClose()
        }
        catch(err){
            console.error("Google Sign-In Error:", err);
        }
    }
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm p-[1px] rounded-3xl bg-gradient-to-r from-purple-500/40 via-blue-500/30"
          >
            {/* Inner */}
            <div className="relative rounded-3xl bg-[#0b0b0b] border border-white/10 shadow-2xl overflow-hidden">

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
              >
                ✕
              </button>

              <div className="px-8 py-12 text-center">

                {/* Title */}
                <h1 className="text-xl font-bold mb-2">
                  Welcome Back
                </h1>

                <p className="text-zinc-400 text-sm mb-8">
                  Sign in to continue to AI Website Builder
                </p>

                {/* Google Button */}
                <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-black font-medium hover:scale-105 transition" onClick = {handleGoogleAuth}>

                  {/* Google Logo (SVG) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="w-5 h-5"
                  >
                    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C33.7 6.1 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C33.7 6.1 29.1 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.3l-6.2-5.1C29.3 35.7 26.8 36.7 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.5 39.7 16.2 44 24 44z"/>
                    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.4 5.6-6.3 7.1l6.2 5.1C40.9 36.6 44 30.8 44 24c0-1.3-.1-2.3-.4-3.5z"/>
                  </svg>

                  Continue with Google
                </button>

                <p className="text-xs text-zinc-500 mt-6">
                  By continuing, you agree to our Terms & Privacy Policy
                </p>

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;