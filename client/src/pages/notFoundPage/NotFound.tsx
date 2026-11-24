import Button from "../../components/ui/Button";
import { House, LucideAlertCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center lg:min-h-[calc(100vh-60px)] min-h-[calc(100vh-60px)] text-center p-6">
      <h1 className="lg:text-5xl text-2xl font-bold text-red-600 mb-4 flex items-center gap-x-2">
        <LucideAlertCircle className="lg:h-10 lg:w-10 h-6 w-6" />
        <span>404 !</span>
        <span>Not Found</span>
      </h1>
      <p className="lg:text-xl mb-6">
        Oops! Perhaps the page you're looking for doesn't exist.
      </p>
      <Button href="/" className="shadow-lg">
        <House /> Go Home
      </Button>
    </div>
  );
};

export default NotFound;
