import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/landing-page");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]); // ✅ Added navigate to dependency array

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#E9C4B4] text-center p-6">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-3xl font-bold mb-2 text-[#350B0F]">Nice job, bartender!</h1>
      <p className="text-lg text-[#9B1C23]">You're in. Redirecting to your landing page...</p>
    </div>
  );
};

export default GameSuccess;
