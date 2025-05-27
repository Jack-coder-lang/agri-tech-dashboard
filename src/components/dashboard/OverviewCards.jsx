"use client"
import { motion } from "framer-motion"
import { Droplets, Thermometer, CloudRain, Sprout, AlertTriangle, Activity, Beaker, Shield } from "lucide-react"

const OverviewCards = ({ processedData }) => {
  // Fonction pour déterminer le statut en fonction des valeurs optimales
  const getStatus = (value, optimalRange) => {
    if (!value || !optimalRange) return "normal"
    if (value >= optimalRange.min && value <= optimalRange.max) return "normal"
    if (value < optimalRange.min * 0.9 || value > optimalRange.max * 1.1) return "error"
    return "warning"
  }

  const cards = [
    {
      id: "moisture",
      title: "Humidité du sol",
      value: `${processedData.moisture?.current?.toFixed(1) || "--"}`,
      icon: Droplets,
      color: "text-blue-500",
      bg: "bg-blue-100",
      status: getStatus(processedData.moisture?.current, processedData.moisture?.optimal),
      details: processedData.moisture?.optimal
        ? `Optimal: ${processedData.moisture.optimal.min || 800}-${processedData.moisture.optimal.max || 1800}`
        : "Données en temps réel",
    },
    {
      id: "temperature",
      title: "Température du sol",
      value: `${processedData.temperature?.current?.toFixed(1) || "--"}°C`,
      icon: Thermometer,
      color: "text-red-500",
      bg: "bg-red-100",
      status: getStatus(processedData.temperature?.current, processedData.temperature?.optimal),
      details: processedData.temperature?.optimal
        ? `Optimal: ${processedData.temperature.optimal.min}-${processedData.temperature.optimal.max}°C`
        : "Données en temps réel",
    },
    {
      id: "ph",
      title: "pH du sol",
      value: `${processedData.ph?.current?.toFixed(1) || "--"}`,
      icon: Activity,
      color: "text-green-500",
      bg: "bg-green-100",
      status: getStatus(processedData.ph?.current, processedData.ph?.optimal),
      details: processedData.ph?.optimal
        ? `Optimal: ${processedData.ph.optimal.min}-${processedData.ph.optimal.max}`
        : "Données en temps réel",
    },
    {
      id: "humidity",
      title: "Humidité ambiante",
      value: `${processedData.humidity?.current?.toFixed(1) || "--"}%`,
      icon: CloudRain,
      color: "text-indigo-500",
      bg: "bg-indigo-100",
      status: getStatus(processedData.humidity?.current, processedData.humidity?.optimal),
      details: processedData.humidity?.optimal
        ? `Optimal: ${processedData.humidity.optimal.min}-${processedData.humidity.optimal.max}%`
        : "Données en temps réel",
    },
    {
      id: "tds",
      title: "TDS (Solides dissous)",
      value: `${processedData.TDS?.current?.toFixed(0) || "--"} ppm`,
      icon: Sprout,
      color: "text-purple-500",
      bg: "bg-purple-100",
      status: getStatus(processedData.TDS?.current, processedData.TDS?.optimal),
      details: processedData.TDS?.optimal
        ? `Optimal: ${processedData.TDS.optimal.min}-${processedData.TDS.optimal.max} ppm`
        : "Qualité de l'eau",
    },
    {
      id: "battery",
      title: "Niveau de batterie",
      value: `${processedData.batteryLevel?.toFixed(0) || "--"}%`,
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-100",
      status:
        (processedData.batteryLevel || 0) < 20
          ? "error"
          : (processedData.batteryLevel || 0) < 50
            ? "warning"
            : "normal",
      details: "Capteurs IoT",
    },
  ]

  // Couleurs et textes pour les différents statuts
  const statusConfig = {
    normal: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Normal",
    },
    warning: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      label: "Attention",
    },
    error: {
      bg: "bg-red-100",
      text: "text-red-800",
      label: "Critique",
    },
  }

  // Bloc de visualisation NPK
  const renderNPKBlock = () => {
    const npkData = [
      {
        key: "nitrogen",
        name: "Azote (N)",
        color: "text-blue-600",
        bg: "bg-blue-50",
        value: processedData.nitrogen?.current,
        unit: processedData.nitrogen?.unit || "mg/kg",
      },
      {
        key: "phosphorus",
        name: "Phosphore (P)",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        value: processedData.phosphorus?.current,
        unit: processedData.phosphorus?.unit || "mg/kg",
      },
      {
        key: "potassium",
        name: "Potassium (K)",
        color: "text-purple-600",
        bg: "bg-purple-50",
        value: processedData.potassium?.current,
        unit: processedData.potassium?.unit || "mg/kg",
      },
    ]

    const hasNPKData = npkData.some((nutrient) => nutrient.value !== undefined)

    if (!hasNPKData) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 col-span-full"
      >
        <div className="flex items-center mb-4">
          <div className="bg-green-100 p-3 rounded-lg mr-4">
            <Beaker className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Nutriments NPK</h3>
            <p className="text-sm text-gray-500">Analyse des macronutriments essentiels</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {npkData.map((nutrient, index) => (
            <motion.div
              key={nutrient.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
              className={`${nutrient.bg} p-4 rounded-lg border border-gray-200`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">{nutrient.name}</span>
                <span className={`text-lg font-bold ${nutrient.color}`}>
                  {nutrient.value ? nutrient.value.toFixed(1) : "--"}
                </span>
              </div>
              <div className="text-xs text-gray-500 mb-2">{nutrient.unit}</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: nutrient.value ? `${Math.min((nutrient.value / 100) * 100, 100)}%` : "0%" }}
                  transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                  className={`h-2 rounded-full ${nutrient.color.replace("text", "bg")}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  // Bloc de visualisation des métaux lourds
  const renderHeavyMetalsBlock = () => {
    const metalsData = [
      {
        key: "plomb",
        name: "Plomb (Pb)",
        color: "text-red-600",
        bg: "bg-red-50",
        value: processedData.plomb?.current,
        unit: processedData.plomb?.unit || "mg/kg",
        threshold: 0.1,
        status:
          processedData.plomb?.current > 0.1 ? "error" : processedData.plomb?.current > 0.05 ? "warning" : "normal",
      },
      {
        key: "mercure",
        name: "Mercure (Hg)",
        color: "text-orange-600",
        bg: "bg-orange-50",
        value: processedData.mercure?.current,
        unit: processedData.mercure?.unit || "mg/kg",
        threshold: 0.05,
        status:
          processedData.mercure?.current > 0.05
            ? "error"
            : processedData.mercure?.current > 0.025
              ? "warning"
              : "normal",
      },
      {
        key: "arsenic",
        name: "Arsenic (As)",
        color: "text-purple-700",
        bg: "bg-purple-50",
        value: processedData.arsenic?.current,
        unit: processedData.arsenic?.unit || "mg/kg",
        threshold: 0.02,
        status:
          processedData.arsenic?.current > 0.02
            ? "error"
            : processedData.arsenic?.current > 0.01
              ? "warning"
              : "normal",
      },
    ]

    const hasMetalsData = metalsData.some((metal) => metal.value !== undefined)

    if (!hasMetalsData) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 col-span-full"
      >
        <div className="flex items-center mb-4">
          <div className="bg-red-100 p-3 rounded-lg mr-4">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Métaux Lourds</h3>
            <p className="text-sm text-gray-500">Surveillance de la contamination du sol</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metalsData.map((metal, index) => (
            <motion.div
              key={metal.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
              className={`${metal.bg} p-4 rounded-lg border border-gray-200 relative`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">{metal.name}</span>
                {metal.status !== "normal" && (
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig[metal.status].bg} ${statusConfig[metal.status].text}`}
                  >
                    {statusConfig[metal.status].label}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-lg font-bold ${metal.color}`}>
                  {metal.value ? metal.value.toFixed(4) : "--"}
                </span>
                <span className="text-xs text-gray-500">Seuil: {metal.threshold}</span>
              </div>
              <div className="text-xs text-gray-500 mb-2">{metal.unit}</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: metal.value ? `${Math.min((metal.value / (metal.threshold * 2)) * 100, 100)}%` : "0%",
                  }}
                  transition={{ duration: 1, delay: 1.0 + index * 0.1 }}
                  className={`h-2 rounded-full ${
                    metal.status === "normal"
                      ? "bg-green-500"
                      : metal.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cartes principales */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-start">
              <div className={`${card.bg} p-3 rounded-lg`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-2xl font-semibold text-gray-900">{card.value}</span>
                  {card.status !== "normal" && (
                    <span
                      className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[card.status].bg} ${statusConfig[card.status].text}`}
                    >
                      {statusConfig[card.status].label}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">{card.details}</p>

                {/* Barre de progression pour les indicateurs numériques */}
                {["moisture", "temperature", "ph", "humidity", "tds"].includes(card.id) && processedData[card.id] && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(
                          100,
                          card.id === "ph"
                            ? (processedData[card.id]?.current / 14) * 100
                            : card.id === "tds"
                              ? (processedData[card.id]?.current / 1000) * 100
                              : (processedData[card.id]?.current / 100) * 100,
                        )}%`,
                      }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className={`h-2 rounded-full ${
                        card.status === "normal"
                          ? "bg-green-500"
                          : card.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                  </div>
                )}

                {/* Barre de progression spéciale pour la batterie */}
                {card.id === "battery" && processedData.batteryLevel && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${processedData.batteryLevel}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className={`h-2 rounded-full ${
                        card.status === "normal"
                          ? "bg-green-500"
                          : card.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bloc NPK */}
      {renderNPKBlock()}

      {/* Bloc Métaux Lourds */}
      {renderHeavyMetalsBlock()}
    </div>
  )
}

export default OverviewCards
