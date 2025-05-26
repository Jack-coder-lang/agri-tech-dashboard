"use client"
import { motion } from "framer-motion"
import { User, Bot, Volume2 } from "lucide-react"

const ChatMessage = ({ message, onSpeak }) => {
  const isUser = message.role === "user"

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(message.content)
      utterance.lang = "fr-FR"
      utterance.rate = 0.9
      speechSynthesis.speak(utterance)
    }
    onSpeak?.(message.content)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className={`flex max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? "ml-3" : "mr-3"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser ? "bg-blue-500" : "bg-green-500"
            }`}
          >
            {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
          </div>
        </div>

        {/* Message bubble */}
        <div
          className={`relative px-4 py-2 rounded-lg ${isUser ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"}`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>

          {/* Bouton de lecture vocale pour les messages du bot */}
          {!isUser && (
            <button
              onClick={handleSpeak}
              className="absolute -right-2 -bottom-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-md"
              title="Lire le message"
            >
              <Volume2 className="h-3 w-3 text-white" />
            </button>
          )}

          {/* Timestamp */}
          <div className={`text-xs mt-1 ${isUser ? "text-blue-100" : "text-gray-500"}`}>
            {new Date(message.timestamp).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ChatMessage
