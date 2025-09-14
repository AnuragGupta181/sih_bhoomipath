import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const FloatingChatButton = () => {
  return (
    <Link
      to="/ecosathi"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
    >
      <MessageCircle size={24} />
    </Link>
  );
};

export default FloatingChatButton;