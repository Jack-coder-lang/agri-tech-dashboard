"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, Send, X, Bot } from "lucide-react"
import { io } from "socket.io-client"
import OverviewCards from "./OverviewCards"
import FieldMap from "./FieldMap"
import SoilAnalysisChart from "./SoilAnalysisChart"
import WeatherWidget from "./WeatherWidget"
import RecommendationsList from "./RecommendationsList" 
import LoadingSpinner from "./LoadingSpinner"
// "use client"

// import { useEffect, useState, useRef } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Mic, Send, X, Bot } from "lucide-react"
// import { io } from "socket.io-client"
// import OverviewCards from "./overview-cards" 
// import FieldMap from "./field-map"
// import SoilAnalysisChart from "./soil-analysis-chart"
// import WeatherWidget from "./weather-widget"
// import RecommendationsList from "./recommendations-list"
// import LoadingSpinner from "./loading-spinner"

const Dashboard = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [connectionStatus, setConnectionStatus] = useState("disconnected")
  const [realTimeData, setRealTimeData] = useState(null)
  const [processedData, setProcessedData] = useState({})
  const [chatMessages, setChatMessages] = useState([])
  const [userInput, setUserInput] = useState("")
  const [recommendations, setRecommendations] = useState([])
  const [voiceFrequency, setVoiceFrequency] = useState(1)
  const [isRecording, setIsRecording] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const speechRef = useRef(null)
  const recognitionRef = useRef(null)

  // Fonction pour traiter les données des capteurs en temps réel
  const processSensorData = (sensorData) => {
    const processed = {
      batteryLevel: sensorData.batteryLevel || 0,
      lastUpdated: sensorData.timestamp || new Date().toISOString(),
    }

    // Définir les plages optimales pour chaque métrique
    const optimalRanges = {
      temperature: { min: 18, max: 24 },
      humidity: { min: 40, max: 70 },
      moisture: { min: 25, max: 35 },
      ph: { min: 5.8, max: 7.0 },
      TDS: { min: 200, max: 400 },
    }

    // Traiter chaque lecture de capteur
    sensorData.readings.forEach((reading) => {
      const { type, value, unit } = reading
      const timestamp = sensorData.timestamp || new Date().toISOString()

      switch (type.toLowerCase()) {
        case "temperature":
          processed.temperature = {
            current: value,
            unit,
            timestamp,
            optimal: optimalRanges.temperature,
          }
          break
        case "humidity":
          processed.humidity = {
            current: value,
            unit,
            timestamp,
            optimal: optimalRanges.humidity,
          }
          break
        case "moisture":
          processed.moisture = {
            current: value,
            unit,
            timestamp,
            optimal: optimalRanges.moisture,
          }
          break
        case "soilph":
        case "ph":
          processed.ph = {
            current: value,
            unit,
            timestamp,
            optimal: optimalRanges.ph,
          }
          break
        case "tds":
          processed.TDS = {
            current: value,
            unit,
            timestamp,
            optimal: optimalRanges.TDS,
          }
          break
        case "nitrogen":
          processed.nitrogen = { current: value, unit, timestamp }
          break
        case "phosphorus":
          processed.phosphorus = { current: value, unit, timestamp }
          break
        case "potassium":
          processed.potassium = { current: value, unit, timestamp }
          break
        case "plomb":
          processed.plomb = { current: value, unit, timestamp }
          break
        case "mercure":
          processed.mercure = { current: value, unit, timestamp }
          break
        case "arsenic":
          processed.arsenic = { current: value, unit, timestamp }
          break
        case "distance":
          processed.distance = { current: value, unit, timestamp }
          break
      }
    })

    return processed
  }

  // Fonction pour générer une réponse contextuelle basée sur les données
  const generateContextualResponse = (userQuestion, currentData) => {
    const question = userQuestion.toLowerCase()

    // Analyser l'état général des données
    const getDataStatus = () => {
      const issues = []
      const good = []

      if (currentData.temperature?.current) {
        const temp = currentData.temperature.current
        const optimal = currentData.temperature.optimal
        if (temp < optimal.min) issues.push(`température trop basse (${temp}°C)`)
        else if (temp > optimal.max) issues.push(`température trop élevée (${temp}°C)`)
        else good.push(`température normale (${temp}°C)`)
      }

      if (currentData.ph?.current) {
        const ph = currentData.ph.current
        const optimal = currentData.ph.optimal
        if (ph < optimal.min) issues.push(`pH trop acide (${ph})`)
        else if (ph > optimal.max) issues.push(`pH trop basique (${ph})`)
        else good.push(`pH optimal (${ph})`)
      }

      if (currentData.moisture?.current) {
        const moisture = currentData.moisture.current
        const optimal = currentData.moisture.optimal
        if (moisture < optimal.min) issues.push(`sol trop sec (${moisture}%)`)
        else if (moisture > optimal.max) issues.push(`sol trop humide (${moisture}%)`)
        else good.push(`humidité du sol correcte (${moisture}%)`)
      }

      // Vérifier les métaux lourds
      if (currentData.plomb?.current > 0.1) issues.push(`niveau de plomb critique (${currentData.plomb.current} mg/kg)`)
      if (currentData.mercure?.current > 0.05)
        issues.push(`niveau de mercure critique (${currentData.mercure.current} mg/kg)`)
      if (currentData.arsenic?.current > 0.02)
        issues.push(`niveau d'arsenic critique (${currentData.arsenic.current} mg/kg)`)

      return { issues, good }
    }

    // Questions sur l'état général
    if (question.includes("état") || question.includes("comment") || question.includes("situation")) {
      const status = getDataStatus()
      let response = "Voici l'état actuel de vos cultures : "

      if (status.good.length > 0) {
        response += `Points positifs : ${status.good.join(", ")}. `
      }

      if (status.issues.length > 0) {
        response += `Points d'attention : ${status.issues.join(", ")}. Je recommande de surveiller ces paramètres.`
      } else {
        response += "Tous les paramètres sont dans les normes optimales !"
      }

      return response
    }

    // Questions sur la température
    if (question.includes("température") || question.includes("temp")) {
      if (currentData.temperature?.current) {
        const temp = currentData.temperature.current
        const optimal = currentData.temperature.optimal
        return `La température actuelle du sol est de ${temp}°C. La plage optimale est de ${optimal.min}-${optimal.max}°C. ${
          temp < optimal.min
            ? "Il fait un peu froid, considérez un réchauffement du sol."
            : temp > optimal.max
              ? "Il fait un peu chaud, pensez à l'ombrage ou l'arrosage."
              : "La température est parfaite pour vos cultures !"
        }`
      }
      return "Aucune donnée de température disponible actuellement."
    }

    // Questions sur le pH
    if (question.includes("ph") || question.includes("acidité")) {
      if (currentData.ph?.current) {
        const ph = currentData.ph.current
        const optimal = currentData.ph.optimal
        return `Le pH actuel du sol est de ${ph}. La plage optimale est de ${optimal.min}-${optimal.max}. ${
          ph < optimal.min
            ? "Le sol est trop acide, ajoutez de la chaux."
            : ph > optimal.max
              ? "Le sol est trop basique, ajoutez du soufre ou de la matière organique."
              : "Le pH est parfait pour la plupart des cultures !"
        }`
      }
      return "Aucune donnée de pH disponible actuellement."
    }

    // Questions sur l'humidité
    if (question.includes("humidité") || question.includes("eau") || question.includes("arrosage")) {
      if (currentData.moisture?.current) {
        const moisture = currentData.moisture.current
        const optimal = currentData.moisture.optimal
        return `L'humidité du sol est de ${moisture}%. La plage optimale est de ${optimal.min}-${optimal.max}%. ${
          moisture < optimal.min
            ? "Le sol est trop sec, augmentez l'arrosage."
            : moisture > optimal.max
              ? "Le sol est trop humide, réduisez l'arrosage ou améliorez le drainage."
              : "L'humidité est parfaite !"
        }`
      }
      return "Aucune donnée d'humidité disponible actuellement."
    }

    // Questions sur les nutriments
    if (
      question.includes("nutriment") ||
      question.includes("npk") ||
      question.includes("azote") ||
      question.includes("phosphore") ||
      question.includes("potassium")
    ) {
      let response = "État des nutriments : "
      const nutrients = []

      if (currentData.nitrogen?.current)
        nutrients.push(`Azote: ${currentData.nitrogen.current} ${currentData.nitrogen.unit}`)
      if (currentData.phosphorus?.current)
        nutrients.push(`Phosphore: ${currentData.phosphorus.current} ${currentData.phosphorus.unit}`)
      if (currentData.potassium?.current)
        nutrients.push(`Potassium: ${currentData.potassium.current} ${currentData.potassium.unit}`)

      if (nutrients.length > 0) {
        response += nutrients.join(", ") + ". "
        response += "Assurez-vous que ces niveaux correspondent aux besoins de vos cultures."
      } else {
        response += "Aucune donnée de nutriments disponible actuellement."
      }

      return response
    }

    // Questions sur les métaux lourds
    if (
      question.includes("métaux") ||
      question.includes("pollution") ||
      question.includes("toxique") ||
      question.includes("plomb") ||
      question.includes("mercure") ||
      question.includes("arsenic")
    ) {
      const metals = []
      let hasIssues = false

      if (currentData.plomb?.current) {
        const level = currentData.plomb.current
        metals.push(`Plomb: ${level} mg/kg`)
        if (level > 0.1) hasIssues = true
      }

      if (currentData.mercure?.current) {
        const level = currentData.mercure.current
        metals.push(`Mercure: ${level} mg/kg`)
        if (level > 0.05) hasIssues = true
      }

      if (currentData.arsenic?.current) {
        const level = currentData.arsenic.current
        metals.push(`Arsenic: ${level} mg/kg`)
        if (level > 0.02) hasIssues = true
      }

      if (metals.length > 0) {
        let response = `Niveaux de métaux lourds : ${metals.join(", ")}. `
        if (hasIssues) {
          response +=
            "⚠️ ATTENTION : Certains niveaux dépassent les seuils de sécurité. Consultez un expert en dépollution des sols."
        } else {
          response += "✅ Tous les niveaux sont dans les normes de sécurité."
        }
        return response
      }
      return "Aucune donnée de métaux lourds disponible actuellement."
    }

    // Réponse par défaut
    return `Je comprends votre question sur "${userQuestion}". Basé sur les données actuelles, je peux vous aider avec l'analyse de la température, pH, humidité, nutriments et métaux lourds. Posez-moi une question plus spécifique !`
  }

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
    })

    socket.on("connect", () => {
      setConnectionStatus("connected")
      console.log("Socket.IO connected")
    })

    socket.on("recommendations", (data) => {
      try {
        console.log("Received recommendations:", JSON.stringify(data, null, 2))

        // Traiter les données des capteurs
        if (data.sensor_data) {
          const newRealTimeData = {
            macAddress: data.sensor_data.macAddress || "unknown",
            phase: data.sensor_data.phase || "unknown",
            readings: data.sensor_data.readings || [],
            batteryLevel: data.batteryLevel,
            timestamp: new Date().toISOString(),
          }

          setRealTimeData(newRealTimeData)

          // Traiter les données pour les composants enfants
          const processed = processSensorData(newRealTimeData)
          setProcessedData(processed)
        }

        // Traiter les recommandations
        const recommendation = {
          id: data.recommendation_id || Date.now().toString(),
          title: `Recommandation pour ${data.sensor_data?.phase || "culture"}`,
          description:
            data.recommandations?.resume_vocal ||
            data.recommandations?.description ||
            "Suivez les recommandations pour optimiser votre culture.",
          type: "soil",
          priority: "medium",
          date: new Date().toISOString(),
          actions: data.recommandations?.recommandations || [],
          analyse_sol: data.recommandations?.analyse_sol || "",
          faisabilite: data.recommandations?.faisabilite || "",
          rendement_estime: data.recommandations?.rendement_estime || 0,
          risques_detectes: data.recommandations?.risques_detectes || [],
          recommandations: data.recommandations?.recommandations || [],
          resume_vocal: data.recommandations?.resume_vocal || "",
          evaluation: data.evaluation || {},
        }

        setRecommendations((prev) => [recommendation, ...prev])

        const notificationMessage = {
          id: Date.now(),
          text: `Nouvelle recommandation: ${recommendation.title}. ${recommendation.description}`,
          sender: "system",
          recommendationId: recommendation.id,
        }

        setChatMessages((prev) => {
          const newMessages = [...prev, notificationMessage]
          setHasNewMessage(true)
          if (!isChatOpen) {
            setUnreadCount((prev) => prev + 1)
          }
          return newMessages
        })

        speak(notificationMessage.text)
      } catch (error) {
        console.error("Error processing recommendations:", error)
      }
    })

    socket.on("connect_error", (error) => {
      console.error("Socket.IO error:", error)
      setConnectionStatus("error")
    })

    socket.on("disconnect", () => {
      setConnectionStatus("disconnected")
      console.log("Socket.IO disconnected")
    })

    return () => {
      socket.disconnect()
    }
  }, [isChatOpen])

  useEffect(() => {
    speechRef.current = window.speechSynthesis
    return () => {
      speechRef.current?.cancel()
    }
  }, [])

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "fr-FR"

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setUserInput(transcript)
        setIsRecording(false)
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        setIsRecording(false)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
    }
  }, [])

  const speak = (text) => {
    if (speechRef.current) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "fr-FR"
      utterance.rate = voiceFrequency
      speechRef.current.speak(utterance)
    }
  }

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      setIsRecording(true)
      recognitionRef.current.start()
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleSendMessage = async () => {
    if (!userInput.trim()) return

    const newMessage = {
      id: Date.now(),
      text: userInput,
      sender: "user",
    }
    setChatMessages((prev) => {
      const newMessages = [...prev, newMessage]
      setHasNewMessage(true)
      if (!isChatOpen) {
        setUnreadCount((prev) => prev + 1)
      }
      return newMessages
    })

    // Vérifier s'il y a une recommandation récente pour le feedback
    const lastNotification = chatMessages
      .slice()
      .reverse()
      .find((msg) => msg.sender === "system" && msg.recommendationId)

    // Si c'est un feedback sur une recommandation
    if (lastNotification && userInput.toLowerCase().includes("recommandation")) {
      try {
        const response = await fetch("http://localhost:3000/question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recommendation_id: lastNotification.recommendationId,
            comment: userInput,
          }),
        })

        if (response.ok) {
          const responseMessage = {
            id: Date.now(),
            text: `Réponse enregistrée pour la recommandation: ${lastNotification.text.split(": ")[1]?.split(".")[0] || "recommandation"}. Merci!`,
            sender: "system",
          }
          setChatMessages((prev) => {
            const newMessages = [...prev, responseMessage]
            setHasNewMessage(true)
            if (!isChatOpen) {
              setUnreadCount((prev) => prev + 1)
            }
            return newMessages
          })
          speak(responseMessage.text)
        }
      } catch (error) {
        console.error("Error sending feedback:", error)
      }
    } else {
      // Générer une réponse contextuelle basée sur les données actuelles
      const contextualResponse = generateContextualResponse(userInput, processedData)

      const responseMessage = {
        id: Date.now() + 1,
        text: contextualResponse,
        sender: "system",
      }

      setChatMessages((prev) => {
        const newMessages = [...prev, responseMessage]
        setHasNewMessage(true)
        if (!isChatOpen) {
          setUnreadCount((prev) => prev + 1)
        }
        return newMessages
      })

      speak(contextualResponse)

      // Optionnel : Envoyer aussi la question au serveur pour logging/analyse
      try {
        await fetch("http://localhost:3000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: userInput,
            sensor_data: processedData,
            timestamp: new Date().toISOString(),
          }),
        })
      } catch (error) {
        console.error("Error logging chat:", error)
      }
    }

    setUserInput("")
  }

  const handleChatToggle = () => {
    setIsChatOpen((prev) => {
      if (!prev) {
        setUnreadCount(0)
      }
      return !prev
    })
  }

  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -10 },
  }

  const barVariants = {
    animate: (i) => ({
      height: [5, 20, 5],
      transition: {
        duration: 0.5,
        repeat: Number.POSITIVE_INFINITY,
        delay: i * 0.1,
        ease: "easeInOut",
      },
    }),
    stop: {
      height: 5,
      transition: { duration: 0.2 },
    },
  }

  if (loading) {
    return <LoadingSpinner message="Chargement des données agricoles..." />
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 flex justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-full max-w-3xl">
          <h3 className="font-bold text-red-800">Erreur de chargement</h3>
          <p className="text-red-600">{error}</p>
          <button
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      </motion.div>
    )
  }

  const tabs = [
    { id: "overview", label: "Vue d'ensemble" },
    { id: "soil", label: "Sol & Eau" },
    { id: "crops", label: "Cultures" },
    { id: "recommendations", label: "Recommandations" },
  ]

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord agricole</h1>
          <span className={`text-sm ${connectionStatus === "connected" ? "text-green-600" : "text-red-600"}`}>
            WebSocket: {connectionStatus}
          </span>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-4 overflow-x-auto pb-2" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-2 px-3 border-b-2 font-medium text-sm transition-colors duration-200 relative`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={tabContentVariants} initial="hidden" animate="visible" exit="exit">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <OverviewCards processedData={processedData} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow p-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Carte des parcelles</h2>
                      <FieldMap height="500px" interactive={true} className="mb-6" />
                    </div>
                  </div>
                  <div>
                    <div className="bg-white rounded-lg shadow p-6 h-full">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Météo</h2>
                      <WeatherWidget />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Analyse du sol</h2>
                    <SoilAnalysisChart metricType="all" processedData={processedData} />
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Recommandations IA</h2>
                    <RecommendationsList limit={3} recommendations={recommendations} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "soil" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Analyse détaillée du sol</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-2">pH du sol</h3>
                      <SoilAnalysisChart metricType="ph" processedData={processedData} />
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-2">Humidité</h3>
                      <SoilAnalysisChart metricType="moisture" processedData={processedData} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-2">Température</h3>
                      <SoilAnalysisChart metricType="temperature" processedData={processedData} />
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-2">TDS</h3>
                      <SoilAnalysisChart metricType="tds" processedData={processedData} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "crops" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Cultures en cours</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Culture
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Parcelle
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Surface
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Plantation
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Récolte prévue
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            État
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Croissance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[
                          {
                            crop: "Tomate",
                            field: "Champ #1",
                            area: "10 ha",
                            planting: "15/03/2025",
                            harvest: "15/07/2025",
                            status: "success",
                            growth: 65,
                          },
                          {
                            crop: "Maïs",
                            field: "Champ #2",
                            area: "15 ha",
                            planting: "01/04/2025",
                            harvest: "15/08/2025",
                            status: "warning",
                            growth: 45,
                          },
                          {
                            crop: "Pommes de terre",
                            field: "Champ #3",
                            area: "5 ha",
                            planting: "15/04/2025",
                            harvest: "01/09/2025",
                            status: "danger",
                            growth: 35,
                          },
                        ].map((row, rowIndex) => (
                          <motion.tr
                            key={row.crop}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: rowIndex * 0.1 }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {row.crop}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.field}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.area}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.planting}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.harvest}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  row.status === "success"
                                    ? "bg-green-100 text-green-800"
                                    : row.status === "warning"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {row.status === "success"
                                  ? "Bon"
                                  : row.status === "warning"
                                    ? "À surveiller"
                                    : "Critique"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${row.growth}%` }}
                                  transition={{ duration: 1, delay: rowIndex * 0.2 }}
                                  className={`h-2.5 rounded-full ${
                                    row.status === "success"
                                      ? "bg-green-600"
                                      : row.status === "warning"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                  }`}
                                />
                              </div>
                              <span className="text-xs text-gray-500">{row.growth}%</span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "recommendations" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Recommandations IA</h2>
                  <RecommendationsList recommendations={recommendations} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Chat Button */}
      <button
        onClick={handleChatToggle}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: hasNewMessage ? 360 : 0 }}
            transition={{ duration: 0.5, repeat: hasNewMessage ? 1 : 0, ease: "linear" }}
            onAnimationComplete={() => setHasNewMessage(false)}
          >
            <Bot className="h-6 w-6" />
          </motion.div>
          {unreadCount > 0 && !isChatOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
            >
              {unreadCount}
            </motion.div>
          )}
        </div>
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-16 right-4 w-80 bg-white rounded-lg shadow-lg p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ y: hasNewMessage ? [-5, 0, -5] : 0 }}
                  transition={{ duration: 0.5, repeat: hasNewMessage ? 1 : 0, ease: "easeInOut" }}
                  onAnimationComplete={() => setHasNewMessage(false)}
                >
                  <Bot className="h-6 w-6 text-blue-600" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-800">Chatbot Agricole</h3>
              </div>
              <button onClick={handleChatToggle} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="h-48 overflow-y-auto mb-4 p-2 border border-gray-200 rounded">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-2 p-2 rounded-lg ${
                    message.sender === "user" ? "bg-blue-100 ml-auto" : "bg-gray-100"
                  } max-w-[80%]`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Posez votre question..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="relative flex items-center">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-2 rounded-full ${
                    isRecording ? "bg-red-500" : "bg-gray-200"
                  } hover:bg-gray-300 transition-colors`}
                >
                  {isRecording ? <X className="h-5 w-5 text-white" /> : <Mic className="h-5 w-5 text-gray-600" />}
                </button>
                {isRecording && (
                  <div className="flex items-center space-x-0.5 ml-2">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        custom={i}
                        variants={barVariants}
                        animate="animate"
                        className="w-1 bg-blue-600 rounded"
                        style={{ height: "5px" }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleSendMessage}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2 flex items-center space-x-2 flex-wrap">
              <label className="text-sm text-gray-600">Fréquence vocale :</label>
              <select
                value={voiceFrequency}
                onChange={(e) => setVoiceFrequency(Number(e.target.value))}
                className="p-1 border border-gray-300 rounded-md text-sm"
              >
                <option value={0.5}>0.5x (Grave)</option>
                <option value={1}>1x (Normal)</option>
                <option value={1.5}>1.5x (Aigu)</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default Dashboard
