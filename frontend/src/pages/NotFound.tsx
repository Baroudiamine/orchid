import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
<<<<<<< HEAD
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
=======
        <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">404</h1>
        <p className="font-lora text-xl text-gray-600 mb-4">Oops! Page not found</p>
>>>>>>> c77a2c4 (Initial commit)
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
