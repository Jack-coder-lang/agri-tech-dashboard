"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"
import ChatMessage from "./ChatMessage"
import VoiceButton from "./VoiceButton"

const Chatbot = ({ recommendations, soilData, onRecommendationResponse }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Bonjour ! Je suis votre assistant agricole IA. Je peux vous aider avec vos cultures, analyser vos données de sol, et répondre à vos questions. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simulation de l'API IA pour générer des réponses
  const generateAIResponse = async (userMessage) => {
    // Dans un vrai projet, vous utiliseriez l'AI SDK ici
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const lowerMessage = userMessage.toLowerCase()

    // Réponses contextuelles basées sur les données agricoles
    if (lowerMessage.includes("sol") || lowerMessage.includes("ph") || lowerMessage.includes("humidité")) {
      const phValue = soilData?.ph?.current || 7.2
      const moisture = soilData?.moisture?.current || 65
      return `D'après les dernières données de vos capteurs :
      
📊 **État du sol actuel :**
• pH : ${phValue} (${phValue > 7 ? "légèrement alcalin" : phValue < 6.5 ? "légèrement acide" : "optimal"})
• Humidité : ${moisture}% (${moisture > 70 ? "élevée" : moisture < 50 ? "faible" : "correcte"})
• Température : ${soilData?.temperature?.current || 18.5}°C

${phValue < 6.5 ? "⚠️ Recommandation : Envisagez un amendement calcaire pour corriger l'acidité." : ""}
${moisture < 50 ? "💧 Recommandation : Augmentez l'irrigation dans les prochaines 24h." : ""}`
    }

    if (lowerMessage.includes("recommandation") || lowerMessage.includes("conseil")) {
      const activeRecommendations = recommendations?.slice(0, 3) || []
      if (activeRecommendations.length > 0) {
        return `Voici vos recommandations prioritaires :

${activeRecommendations
  .map(
    (rec, index) =>
      `${index + 1}. **${rec.title}**
   ${rec.description}
   Priorité : ${rec.priority === "high" ? "🔴 Élevée" : rec.priority === "medium" ? "🟡 Moyenne" : "🟢 Faible"}
`,
  )
  .join("\n")}

Souhaitez-vous que je vous donne plus de détails sur l'une de ces recommandations ?`
      }
    }

    if (lowerMessage.includes("irrigation") || lowerMessage.includes("arrosage")) {
      return `💧 **Conseils d'irrigation :**

Basé sur vos conditions actuelles :
• Humidité du sol : ${soilData?.moisture?.current || 65}%
• Température : ${soilData?.temperature?.current || 18.5}°C

**Recommandations :**
1. Arrosage optimal : tôt le matin (6h-8h) ou en soirée (18h-20h)
2. Fréquence recommandée : ${soilData?.moisture?.current < 50 ? "quotidienne" : "tous les 2-3 jours"}
3. Quantité : 15-20L/m² selon la culture

Voulez-vous que je programme un rappel d'irrigation ?`
    }

    if (lowerMessage.includes("météo") || lowerMessage.includes("temps")) {
      return `🌤️ **Conditions météorologiques :**

**Aujourd'hui :**
• Température : 22°C (min: 15°C, max: 28°C)
• Humidité : 68%
• Vent : 12 km/h SO
• Précipitations : 0mm

**Prévisions 3 jours :**
• Demain : Ensoleillé, 24°C
• Après-demain : Partiellement nuageux, 21°C  
• J+3 : Risque de pluie, 19°C

⚠️ **Alerte :** Possibilité de gel matinal dans 3 jours. Protégez vos cultures sensibles.`
    }

    if (lowerMessage.includes("culture") || lowerMessage.includes("plante") || lowerMessage.includes("récolte")) {
      return `🌱 **État de vos cultures :**

**Champ #1 - Blé :**
• Stade : Épiaison (65% de croissance)
• État : Bon
• Récolte prévue : 15 juillet

**Champ #2 - Maïs :**
• Stade : Floraison (45% de croissance)  
• État : À surveiller (stress hydrique léger)
• Action : Augmenter l'irrigation

**Champ #3 - Pommes de terre :**
• Stade : Tubérisation (35% de croissance)
• État : Critique (carence en potassium détectée)
• Action : Fertilisation recommandée

Voulez-vous plus de détails sur une culture spécifique ?`
    }

    // Réponse générale
    const responses = [
      "Je suis là pour vous aider avec la gestion de votre exploitation agricole. Posez-moi des questions sur vos cultures, le sol, l'irrigation, ou les recommandations !",
      "En tant qu'assistant IA agricole, je peux analyser vos données de capteurs, vous donner des conseils personnalisés, et vous aider à optimiser vos rendements.",
      "N'hésitez pas à me demander des informations sur l'état de vos champs, les conditions météo, ou les meilleures pratiques agricoles pour votre région.",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await generateAIResponse(userMessage.content)

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Notification de réponse aux recommandations
      if (userMessage.content.toLowerCase().includes("recommandation")) {
        onRecommendationResponse?.(userMessage.content, response)
      }
    } catch (error) {
      console.error("Erreur lors de la génération de la réponse:", error)
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceInput = (text) => {
    setInput(text)
    // Auto-submit après reconnaissance vocale
    setTimeout(() => {
      const event = { preventDefault: () => {} }
      setInput(text)
      handleSubmit(event)
    }, 500)
  }

  return (
    <>
      {/* Bouton flottant du chatbot */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center z-40 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      {/* Interface du chatbot */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-green-600 text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Assistant Agricole IA</h3>
                  <p className="text-sm text-green-100">En ligne</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white hover:text-green-200 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-500">L'IA réfléchit...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSubmit} className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Posez votre question..."
                    className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <VoiceButton
                    onVoiceInput={handleVoiceInput}
                    isListening={isListening}
                    onToggleListening={setIsListening}
                    disabled={isLoading}
                  />

                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-12 h-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-25 z-40" onClick={() => setIsOpen(false)} />}
    </>
  )
}

export default Chatbot
