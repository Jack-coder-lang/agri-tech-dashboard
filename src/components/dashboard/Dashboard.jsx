import React, { useEffect, useState, useRef } from 'react';
import { useData } from '../../contexts/DataContext';
import OverviewCards from './OverviewCards';
import FieldMap from './FieldMap';
import SoilAnalysisChart from './SoilAnalysisChart';
import WeatherWidget from './WeatherWidget';
import RecommendationsList from './RecommendationsList';
import LoadingSpinner from '../ui/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, X, Bot } from 'lucide-react';
import { io } from 'socket.io-client';

const Dashboard = () => {
  const { loading, error, soilConditions } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [realTimeData, setRealTimeData] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [voiceFrequency, setVoiceFrequency] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const speechRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const socket = io('http://localhost:3000', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      setConnectionStatus('connected');
      console.log('Socket.IO connected');
    });

    socket.on('recommendations', (data) => {
      try {
        console.log('Received recommendations:', JSON.stringify(data, null, 2));

        const recommendation = {
          id: data.recommendation_id || Date.now().toString(),
          title: `Recommandation pour ${data.sensor_data?.phase || 'culture'}`,
          description: data.recommandations?.resume_vocal || data.recommandations?.description || 'Suivez les recommandations pour optimiser votre culture.',
          analyse_sol: data.recommandations?.analyse_sol || '',
          faisabilite: data.recommandations?.faisabilite || '',
          rendement_estime: data.recommandations?.rendement_estime || 0,
          risques_detectes: data.recommandations?.risques_detectes || [],
          recommandations: data.recommandations?.recommandations || [],
          resume_vocal: data.recommandations?.resume_vocal || '',
          evaluation: data.evaluation || {},
        };

        setRecommendations((prev) => [
          ...prev,
          { ...recommendation, id: Date.now().toString() },
        ]);

        const notificationMessage = {
          id: Date.now(),
          text: `Nouvelle recommandation: ${recommendation.title}. ${recommendation.description}`,
          sender: 'system',
          recommendationId: recommendation.id,
        };

        setChatMessages((prev) => {
          const newMessages = [...prev, notificationMessage];
          setHasNewMessage(true);
          if (!isChatOpen) {
            setUnreadCount((prev) => prev + 1);
          }
          return newMessages;
        });

        speak(notificationMessage.text);

        setRealTimeData({
          readings: data.sensor_data ? [data.sensor_data] : [],
          macAddress: data.macAddress || 'unknown',
          batteryLevel: data.batteryLevel || 0,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error processing recommendations:', error);
      }
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO error:', error);
      setConnectionStatus('error');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
      console.log('Socket.IO disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [isChatOpen]);

  useEffect(() => {
    speechRef.current = window.speechSynthesis;
    return () => {
      speechRef.current.cancel();
    };
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const speak = (text) => {
    if (speechRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = voiceFrequency;
      speechRef.current.speak(utterance);
    }
  };

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: userInput,
      sender: 'user',
    };
    setChatMessages((prev) => {
      const newMessages = [...prev, newMessage];
      setHasNewMessage(true);
      if (!isChatOpen) {
        setUnreadCount((prev) => prev + 1);
      }
      return newMessages;
    });

    const lastNotification = chatMessages
      .slice()
      .reverse()
      .find((msg) => msg.sender === 'system' && msg.recommendationId);

    if (lastNotification) {
      try {
        const response = await fetch('http://localhost:3000/question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recommendation_id: lastNotification.recommendationId,
            comment: userInput,
          }),
        });

        if (response.ok) {
          const responseMessage = {
            id: Date.now(),
            text: `Réponse enregistrée pour la recommandation: ${lastNotification.text.split(': ')[1].split('.')[0]}. Merci!`,
            sender: 'system',
          };
          setChatMessages((prev) => {
            const newMessages = [...prev, responseMessage];
            setHasNewMessage(true);
            if (!isChatOpen) {
              setUnreadCount((prev) => prev + 1);
            }
            return newMessages;
          });
          speak(responseMessage.text);
        }
      } catch (error) {
        console.error('Error sending feedback:', error);
      }
    }

    setUserInput('');
  };

  const mergedData = () => {
    const fieldData = soilConditions['field-1'] || {};
    if (!realTimeData) return fieldData;

    const merged = { ...fieldData };
    if (realTimeData.readings) {
      realTimeData.readings.forEach((reading) => {
        merged[reading.type] = {
          ...merged[reading.type],
          current: reading.value,
          unit: reading.unit,
          timestamp: reading.timestamp,
        };
      });
    }
    if (realTimeData.batteryLevel) {
      merged.batteryLevel = realTimeData.batteryLevel;
    }
    return merged;
  };

  const addNewNotification = (title, description) => {
    const simulatedRecommendation = {
      id: Date.now().toString(),
      title,
      description,
      analyse_sol: 'Sol adapté pour la culture.',
      faisabilite: 'Faisable avec amendements.',
      rendement_estime: 5.0,
      risques_detectes: [],
      recommandations: [description],
      resume_vocal: description,
      evaluation: { score_pertinence: 8, score_exactitude: 9, score_applicabilite: 7, commentaires: [] },
    };

    setRecommendations((prev) => [
      ...prev,
      simulatedRecommendation,
    ]);

    const notificationMessage = {
      id: Date.now(),
      text: `Nouvelle recommandation: ${simulatedRecommendation.title}. ${simulatedRecommendation.description}`,
      sender: 'system',
      recommendationId: simulatedRecommendation.id,
    };

    setChatMessages((prev) => {
      const newMessages = [...prev, notificationMessage];
      setHasNewMessage(true);
      if (!isChatOpen) {
        setUnreadCount((prev) => prev + 1);
      }
      return newMessages;
    });

    speak(notificationMessage.text);
  };

  const simulateMultipleNotifications = () => {
    const notifications = [
      {
        title: "Augmenter l'irrigation",
        description: "Les niveaux d'humidité sont bas, envisagez d'augmenter l'irrigation de 10 mm/semaine.",
      },
      {
        title: "Vérifier les nutriments",
        description: "Les niveaux de nutriments sont en baisse, envisagez une fertilisation supplémentaire.",
      },
      {
        title: "Alerte météo",
        description: "Une forte pluie est prévue demain, ajustez vos plans d'irrigation en conséquence.",
      },
    ];

    notifications.forEach((notification, index) => {
      setTimeout(() => {
        addNewNotification(notification.title, notification.description);
      }, index * 5000);
    });
  };

  const handleChatToggle = () => {
    setIsChatOpen((prev) => {
      if (!prev) {
        setUnreadCount(0);
      }
      return !prev;
    });
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: { opacity: 0, y: -10 },
  };

  const barVariants = {
    animate: (i) => ({
      height: [5, 20, 5],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        delay: i * 0.1,
        ease: 'easeInOut',
      },
    }),
    stop: {
      height: 5,
      transition: { duration: 0.2 },
    },
  };

  if (loading) {
    return <LoadingSpinner message="Chargement des données agricoles..." />;
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 flex justify-center">
        <div className="alert-danger w-full max-w-3xl">
          <h3 className="font-bold">Erreur de chargement</h3>
          <p>{error}</p>
          <button className="mt-2 btn btn-primary" onClick={() => window.location.reload()}>
            Réessayer
          </button>
        </div>
      </motion.div>
    );
  }

  const tabs = [
    { id: 'overview', label: "Vue d'ensemble" },
    { id: 'soil', label: 'Sol & Eau' },
    { id: 'crops', label: 'Cultures' },
    { id: 'recommendations', label: 'Recommandations' },
  ];

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord agricole</h1>
          <span className={`text-sm ${connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
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
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-3 border-b-2 font-medium text-sm transition-colors duration-200 relative`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={tabContentVariants} initial="hidden" animate="visible" exit="exit">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <OverviewCards realTimeData={realTimeData} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="card">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Carte des parcelles</h2>
                      <FieldMap height="500px" interactive={true} className="mb-6" />
                    </div>
                  </div>
                  <div>
                    <div className="card h-full">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Météo</h2>
                      <WeatherWidget />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Analyse du sol</h2>
                    <SoilAnalysisChart metricType="all" realTimeData={realTimeData} />
                  </div>
                  <div className="card">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Recommandations IA</h2>
                    <RecommendationsList limit={3} soilData={mergedData()} recommendations={recommendations} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'soil' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Analyse détaillée du sol</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-2">pH du sol</h3>
                      <SoilAnalysisChart metricType="ph" realTimeData={realTimeData} />
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-2">Humidité</h3>
                      <SoilAnalysisChart metricType="moisture" realTimeData={realTimeData} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-2">Température</h3>
                      <SoilAnalysisChart metricType="temperature" realTimeData={realTimeData} />
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-2">Nutriments</h3>
                      <SoilAnalysisChart metricType="nutrient" realTimeData={realTimeData} />
                    </div>
                  </div>
                </div>
                <div className="card">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Métaux lourds</h2>
                  <SoilAnalysisChart metricType="heavyMetals" realTimeData={realTimeData} />
                </div>
                <div className="card">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Qualité de l'eau d'irrigation</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'TDS', value: mergedData().tds?.current || 325, unit: 'ppm', status: 'success' },
                      { name: 'pH', value: mergedData().ph?.current || 7.2, unit: '', status: 'success' },
                      { name: 'Turbidité', value: 15, unit: 'NTU', status: 'warning' },
                      { name: 'Température', value: mergedData().temperature?.current || 18.5, unit: '°C', status: 'success' },
                    ].map((metric, index) => (
                      <motion.div
                        key={metric.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-blue-50 p-4 rounded-lg"
                      >
                        <h3 className="text-sm font-medium text-gray-500">{metric.name}</h3>
                        <p className="text-2xl font-semibold text-gray-900">
                          {metric.value.toFixed(metric.name === 'pH' ? 1 : 0)}
                          {metric.unit}
                        </p>
                        <span className={`badge badge-${metric.status}`}>
                          {metric.status === 'success' ? 'Excellent' : 'Acceptable'}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'crops' && (
              <div className="space-y-6">
                <div className="card">
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
                          { crop: 'Blé', field: 'Champ #1', area: '10 ha', planting: '15/03/2025', harvest: '15/07/2025', status: 'success', growth: 65 },
                          { crop: 'Maïs', field: 'Champ #2', area: '15 ha', planting: '01/04/2025', harvest: '15/08/2025', status: 'warning', growth: 45 },
                          { crop: 'Pommes de terre', field: 'Champ #3', area: '5 ha', planting: '15/04/2025', harvest: '01/09/2025', status: 'danger', growth: 35 },
                        ].map((row, rowIndex) => (
                          <motion.tr
                            key={row.crop}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: rowIndex * 0.1 }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.crop}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.field}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.area}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.planting}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.harvest}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`badge badge-${row.status}`}>
                                {row.status === 'success' ? 'Bon' : row.status === 'warning' ? 'À surveiller' : 'Critique'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${row.growth}%` }}
                                  transition={{ duration: 1, delay: rowIndex * 0.2 }}
                                  className={`h-2.5 rounded-full ${
                                    row.status === 'success'
                                      ? 'bg-green-600'
                                      : row.status === 'warning'
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Prévisions de rendement</h2>
                    <div className="space-y-4">
                      {[
                        { crop: 'Blé', yield: 5.2, target: 5.5, status: 'success' },
                        { crop: 'Maïs', yield: 8.3, target: 9.0, status: 'warning' },
                        { crop: 'Pommes de terre', yield: 20.5, target: 25.0, status: 'danger' },
                      ].map((item, index) => {
                        const percentage = Math.round((item.yield / item.target) * 100);
                        return (
                          <motion.div
                            key={item.crop}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">{item.crop}</span>
                              <span className="text-sm font-medium text-gray-700">{item.yield} t/ha</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                                className={`h-2.5 rounded-full ${
                                  item.status === 'success'
                                    ? 'bg-green-600'
                                    : item.status === 'warning'
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                              />
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-gray-500">Prévision initiale: ${item.target} t/ha</span>
                              <span className="text-xs text-gray-500">{percentage}% de l'objectif</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="card">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Historique de croissance</h2>
                    <div className="h-64 bg-gray-100 rounded flex justify-center items-center">
                      <p className="text-gray-500">Graphique d'historique de croissance</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Recommandations IA</h2>
                  <RecommendationsList soilData={mergedData()} recommendations={recommendations} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={handleChatToggle}
        className="fixed bottom-4 right-4 bg-[var(--color-primary)] text-white p-3 rounded-full shadow-lg hover:bg-[var(--color-primary-dark)] transition-colors"
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
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
            >
              {unreadCount}
            </motion.div>
          )}
        </div>
      </button>

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
                  <Bot className="h-6 w-6 text-[var(--color-primary)]" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-800">Chatbot Agricole</h3>
              </div>
              <button
                onClick={handleChatToggle}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="h-48 overflow-y-auto mb-4 p-2 border border-gray-200 rounded">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-2 p-2 rounded-lg ${
                    message.sender === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
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
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Répondre..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <div className="relative flex items-center">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-2 rounded-full ${
                    isRecording ? 'bg-red-500' : 'bg-gray-200'
                  } hover:bg-gray-300 transition-colors`}
                >
                  {isRecording ? (
                    <X className="h-5 w-5 text-gray-600" />
                  ) : (
                    <Mic className="h-5 w-5 text-gray-600" />
                  )}
                </button>
                {isRecording && (
                  <div className="flex items-center space-x-0.5 ml-2">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        custom={i}
                        variants={barVariants}
                        animate="animate"
                        className="w-1 bg-[var(--color-primary)] rounded"
                        style={{ height: '5px' }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleSendMessage}
                className="p-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
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
              <button
                onClick={() => (
                  addNewNotification(
                    "Augmenter l'irrigation",
                    "Les niveaux d'humidité sont bas, envisagez d'augmenter l'irrigation de 10 mm/semaine."
                  )
                )}
                className="p-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                Simuler une notification
              </button>
              <button
                onClick={simulateMultipleNotifications}
                className="p-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Simuler plusieurs notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Dashboard;