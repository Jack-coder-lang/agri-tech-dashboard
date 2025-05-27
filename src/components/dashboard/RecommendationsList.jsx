import { Leaf, Droplets, AlertTriangle, Calendar, CheckCircle, Clock } from "lucide-react"

const RecommendationsList = ({ limit, recommendations }) => {
  const displayRecommendations = limit ? recommendations.slice(0, limit) : recommendations

  const getIconForType = (type) => {
    switch (type) {
      case "crop":
        return <Leaf className="h-5 w-5 text-green-500" />
      case "soil":
        return <Leaf className="h-5 w-5 text-amber-600" />
      case "irrigation":
        return <Droplets className="h-5 w-5 text-blue-500" />
      case "pest":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "harvest":
        return <Calendar className="h-5 w-5 text-purple-500" />
      default:
        return <Leaf className="h-5 w-5 text-green-500" />
    }
  }

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Fonction pour convertir les objets en strings lisibles
  const renderValue = (value) => {
    if (value === null || value === undefined) return ""
    if (typeof value === "string") return value
    if (typeof value === "number") return value.toString()
    if (typeof value === "boolean") return value ? "Oui" : "Non"
    if (typeof value === "object") {
      // Si c'est un objet, on essaie de l'afficher de manière lisible
      if (Array.isArray(value)) {
        return value.map((item) => (typeof item === "object" ? JSON.stringify(item) : String(item))).join(", ")
      }
      // Pour les objets avec des clés spécifiques comme {probleme, recommandation}
      if (value.probleme && value.recommandation) {
        return `${value.probleme} - ${value.recommandation}`
      }
      return JSON.stringify(value)
    }
    return String(value)
  }

  // Fonction pour rendre les recommandations (qui peuvent être des objets ou des strings)
  const renderRecommendations = (recommandations) => {
    if (!recommandations || !Array.isArray(recommandations)) return null

    return recommandations.map((item, index) => (
      <li key={index}>
        {typeof item === "object"
          ? item.probleme && item.recommandation
            ? `${item.probleme} - ${item.recommandation}`
            : JSON.stringify(item)
          : String(item)}
      </li>
    ))
  }

  if (displayRecommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <p className="text-gray-500">Aucune recommandation pour le moment</p>
        <p className="text-sm text-gray-400 mt-1">Les nouvelles recommandations apparaîtront ici</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {displayRecommendations.map((recommendation) => (
        <div
          key={recommendation.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start">
            <div className="mr-3 mt-0.5">{getIconForType(recommendation.type)}</div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-gray-900">{renderValue(recommendation.title)}</h3>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPriorityClass(recommendation.priority)}`}
                >
                  {recommendation.priority === "high"
                    ? "Prioritaire"
                    : recommendation.priority === "medium"
                      ? "Modéré"
                      : "Faible"}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{renderValue(recommendation.description)}</p>

              {recommendation.faisabilite && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                  <strong className="text-blue-800">Faisabilité:</strong> {renderValue(recommendation.faisabilite)}
                </div>
              )}

              {recommendation.rendement_estime && (
                <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                  <strong className="text-green-800">Rendement estimé:</strong>{" "}
                  {renderValue(recommendation.rendement_estime)}
                </div>
              )}

              {recommendation.risques_detectes && recommendation.risques_detectes.length > 0 && (
                <div className="mt-2 p-2 bg-red-50 rounded text-sm">
                  <strong className="text-red-800">Risques détectés:</strong>
                  <ul className="list-disc list-inside mt-1 text-red-700">
                    {recommendation.risques_detectes.map((risque, index) => (
                      <li key={index}>{renderValue(risque)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {recommendation.recommandations && recommendation.recommandations.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-xs font-medium text-gray-700 mb-1">Actions recommandées:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
                    {renderRecommendations(recommendation.recommandations)}
                  </ul>
                </div>
              )}

              {recommendation.evaluation && (
                <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                  <div className="flex items-center space-x-4 text-xs">
                    {recommendation.evaluation.score_pertinence && (
                      <span>Pertinence: {renderValue(recommendation.evaluation.score_pertinence)}/10</span>
                    )}
                    {recommendation.evaluation.score_exactitude && (
                      <span>Exactitude: {renderValue(recommendation.evaluation.score_exactitude)}/10</span>
                    )}
                    {recommendation.evaluation.score_applicabilite && (
                      <span>Applicabilité: {renderValue(recommendation.evaluation.score_applicabilite)}/10</span>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-3 flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                Recommandation du {new Date(recommendation.date).toLocaleDateString("fr-FR")}
              </div>
            </div>
          </div>
        </div>
      ))}

      {limit && recommendations.length > limit && (
        <div className="text-center">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
            Voir toutes les recommandations ({recommendations.length})
          </button>
        </div>
      )}
    </div>
  )
}

export default RecommendationsList
