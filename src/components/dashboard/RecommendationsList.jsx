import React from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  Leaf, 
  Droplets, 
  AlertTriangle, 
  Calendar,
  Search, 
  Filter, 
  MessageSquare, 
  Volume2, 
  CheckCircle, 
  Clock 
} from 'lucide-react';

const RecommendationsList = ({ limit }) => {
  const { recommendations } = useData();
  
  const displayRecommendations = limit 
    ? recommendations.slice(0, limit) 
    : recommendations;
  
  const getIconForType = (type) => {
    switch(type) {
      case 'crop':
        return <Leaf className="h-5 w-5 text-green-500" />;
      case 'soil':
        return (
          <div className="h-5 w-5 flex items-center justify-center text-brown-500">
            <span className="text-sm" style={{ color: '#795548' }}>🌱</span>
          </div>
        );
      case 'irrigation':
        return <Droplets className="h-5 w-5 text-blue-500" />;
      case 'pest':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'harvest':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return <Leaf className="h-5 w-5 text-green-500" />;
    }
  };
  
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {displayRecommendations.map((recommendation) => (
        <div key={recommendation.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start">
            <div className="mr-3 mt-0.5">
              {getIconForType(recommendation.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-gray-900">{recommendation.title}</h3>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPriorityClass(recommendation.priority)}`}>
                  {recommendation.priority === 'high' ? 'Prioritaire' : 
                   recommendation.priority === 'medium' ? 'Modéré' : 'Faible'}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{recommendation.description}</p>
              
              {recommendation.actions && recommendation.actions.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-xs font-medium text-gray-700 mb-1">Actions recommandées:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
                    {recommendation.actions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-3 text-xs text-gray-500">
                Recommandation du {new Date(recommendation.date).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {limit && recommendations.length > limit && (
        <div className="text-center">
          <a 
            href="#recommendations" 
            className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
          >
            Voir toutes les recommandations ({recommendations.length})
          </a>
        </div>
      )}
    </div>
  );
};

export default RecommendationsList;