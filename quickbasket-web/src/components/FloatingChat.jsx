import { MessageCircle } from "lucide-react";

export default function FloatingChat() {
  return (
    <a
      href="https://wa.me/917972227009" // Replace with your WhatsApp number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-xl hover:bg-green-700 transition transform hover:scale-105"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="sr-only">Chat with us on WhatsApp</span>
    </a>
  );
}
