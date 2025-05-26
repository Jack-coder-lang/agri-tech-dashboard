"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, MicOff } from "lucide-react"
import { motion } from "framer-motion"

const VoiceButton = ({ onVoiceInput, isListening, onToggleListening, disabled }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const mediaRecorderRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const animationFrameRef = useRef(null)

  // Fonction pour démarrer l'enregistrement
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Configuration de l'analyseur audio pour visualiser le niveau
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      analyserRef.current.fftSize = 256
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      // Animation du niveau audio
      const updateAudioLevel = () => {
        analyserRef.current.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b) / bufferLength
        setAudioLevel(average / 255)
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
      }
      updateAudioLevel()

      // Configuration du MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream)
      const audioChunks = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })

        // Ici vous pouvez intégrer un service de reconnaissance vocale
        // Pour l'exemple, on simule la conversion audio vers texte
        const text = await convertSpeechToText(audioBlob)
        onVoiceInput(text)

        // Nettoyage
        stream.getTracks().forEach((track) => track.stop())
        if (audioContextRef.current) {
          audioContextRef.current.close()
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        setAudioLevel(0)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      onToggleListening(true)
    } catch (error) {
      console.error("Erreur lors de l'accès au microphone:", error)
      alert("Impossible d'accéder au microphone. Vérifiez les permissions.")
    }
  }

  // Fonction pour arrêter l'enregistrement
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      onToggleListening(false)
    }
  }

  // Simulation de la conversion speech-to-text
  const convertSpeechToText = async (audioBlob) => {
    // Dans un vrai projet, vous utiliseriez un service comme:
    // - Web Speech API
    // - Google Speech-to-Text
    // - Azure Speech Services
    // - AWS Transcribe

    // Simulation pour la démo
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const responses = [
      "Quel est l'état de mes cultures ?",
      "Recommande-moi des actions pour améliorer le rendement",
      "Comment optimiser l'irrigation ?",
      "Analyse les données du sol",
      "Quelles sont les prochaines tâches à effectuer ?",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Fonction pour la synthèse vocale
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "fr-FR"
      utterance.rate = 0.9
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  const handleClick = () => {
    if (disabled) return

    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        disabled={disabled}
        className={`
          relative w-12 h-12 rounded-full flex items-center justify-center
          transition-all duration-200 shadow-lg
          ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-gray-900 hover:bg-gray-800"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        animate={{
          boxShadow: isRecording
            ? `0 0 ${20 + audioLevel * 30}px rgba(239, 68, 68, 0.5)`
            : "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        {isRecording ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-white" />}

        {/* Indicateur de niveau audio */}
        {isRecording && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-300"
            animate={{
              scale: 1 + audioLevel * 0.3,
              opacity: 0.7 - audioLevel * 0.3,
            }}
            transition={{ duration: 0.1 }}
          />
        )}
      </motion.button>

      {/* Indicateur d'état */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-red-500 font-medium whitespace-nowrap"
        >
          Écoute en cours...
        </motion.div>
      )}
    </div>
  )
}

export default VoiceButton
