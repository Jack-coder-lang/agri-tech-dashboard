// Mock sensor data
export const sensorData = [
  {
    id: 'sensor-1',
    name: 'Soil Moisture Sensor 1',
    type: 'moisture',
    location: { lat: 48.8566, lng: 2.3522 },
    fieldId: 'field-1',
    status: 'active',
    lastReading: { value: 35, unit: '%', timestamp: '2025-05-15T10:30:00Z' },
    batteryLevel: 75
  },
  {
    id: 'sensor-2',
    name: 'Soil pH Sensor 1',
    type: 'ph',
    location: { lat: 48.8566, lng: 2.3525 },
    fieldId: 'field-1',
    status: 'active',
    lastReading: { value: 6.2, unit: 'pH', timestamp: '2025-05-15T10:35:00Z' },
    batteryLevel: 82
  },
  {
    id: 'sensor-3',
    name: 'Temperature Sensor 1',
    type: 'temperature',
    location: { lat: 48.8570, lng: 2.3522 },
    fieldId: 'field-1',
    status: 'active',
    lastReading: { value: 22.5, unit: '°C', timestamp: '2025-05-15T10:40:00Z' },
    batteryLevel: 90
  },
  {
    id: 'sensor-4',
    name: 'Heavy Metal Sensor 1',
    type: 'metal',
    location: { lat: 48.8566, lng: 2.3530 },
    fieldId: 'field-1',
    status: 'warning',
    lastReading: {
      values: [
        { metal: 'Pb', value: 2.3, unit: 'ppm', threshold: 5.0 },
        { metal: 'Hg', value: 0.1, unit: 'ppm', threshold: 0.5 },
        { metal: 'As', value: 3.8, unit: 'ppm', threshold: 5.0 },
      ],
      timestamp: '2025-05-15T10:45:00Z'
    },
    batteryLevel: 45
  },
  {
    id: 'sensor-5',
    name: 'Water Quality Sensor 1',
    type: 'water',
    location: { lat: 48.8575, lng: 2.3522 },
    fieldId: 'field-1',
    status: 'error',
    lastReading: {
      tds: 325,
      ph: 7.2,
      turbidity: 15,
      temperature: 18.5,
      timestamp: '2025-05-15T10:50:00Z'
    },
    batteryLevel: 23
  }
];

// Mock soil data
export const soilData = {
  'field-1': {
    ph: {
      current: 6.2,
      history: [
        { value: 6.2, timestamp: '2025-05-15T10:00:00Z' },
        { value: 6.3, timestamp: '2025-05-14T10:00:00Z' },
        { value: 6.1, timestamp: '2025-05-13T10:00:00Z' },
        { value: 6.0, timestamp: '2025-05-12T10:00:00Z' },
        { value: 6.2, timestamp: '2025-05-11T10:00:00Z' },
        { value: 6.4, timestamp: '2025-05-10T10:00:00Z' },
        { value: 6.3, timestamp: '2025-05-09T10:00:00Z' }
      ],
      optimal: { min: 6.0, max: 7.0 }
    },
    moisture: {
      current: 35,
      history: [
        { value: 35, timestamp: '2025-05-15T10:00:00Z' },
        { value: 38, timestamp: '2025-05-14T10:00:00Z' },
        { value: 40, timestamp: '2025-05-13T10:00:00Z' },
        { value: 42, timestamp: '2025-05-12T10:00:00Z' },
        { value: 37, timestamp: '2025-05-11T10:00:00Z' },
        { value: 35, timestamp: '2025-05-10T10:00:00Z' },
        { value: 34, timestamp: '2025-05-09T10:00:00Z' }
      ],
      optimal: { min: 30, max: 45 }
    },
    temperature: {
      current: 22.5,
      history: [
        { value: 22.5, timestamp: '2025-05-15T10:00:00Z' },
        { value: 22.0, timestamp: '2025-05-14T10:00:00Z' },
        { value: 21.5, timestamp: '2025-05-13T10:00:00Z' },
        { value: 21.0, timestamp: '2025-05-12T10:00:00Z' },
        { value: 20.5, timestamp: '2025-05-11T10:00:00Z' },
        { value: 20.0, timestamp: '2025-05-10T10:00:00Z' },
        { value: 19.5, timestamp: '2025-05-09T10:00:00Z' }
      ],
      optimal: { min: 15, max: 25 }
    },
    heavyMetals: {
      current: [
        { metal: 'Pb', value: 2.3, unit: 'ppm', threshold: 5.0 },
        { metal: 'Hg', value: 0.1, unit: 'ppm', threshold: 0.5 },
        { metal: 'As', value: 3.8, unit: 'ppm', threshold: 5.0 },
      ],
      history: [
        {
          timestamp: '2025-05-15T10:00:00Z',
          values: [
            { metal: 'Pb', value: 2.3, unit: 'ppm' },
            { metal: 'Hg', value: 0.1, unit: 'ppm' },
            { metal: 'As', value: 3.8, unit: 'ppm' },
          ]
        },
        {
          timestamp: '2025-05-08T10:00:00Z',
          values: [
            { metal: 'Pb', value: 2.5, unit: 'ppm' },
            { metal: 'Hg', value: 0.12, unit: 'ppm' },
            { metal: 'As', value: 4.0, unit: 'ppm' },
          ]
        },
        {
          timestamp: '2025-05-01T10:00:00Z',
          values: [
            { metal: 'Pb', value: 2.8, unit: 'ppm' },
            { metal: 'Hg', value: 0.15, unit: 'ppm' },
            { metal: 'As', value: 4.2, unit: 'ppm' },
          ]
        },
      ]
    },
    nutrient: {
      current: {
        nitrogen: 25,
        phosphorus: 15,
        potassium: 20
      },
      history: [
        {
          timestamp: '2025-05-15T10:00:00Z',
          nitrogen: 25,
          phosphorus: 15,
          potassium: 20
        },
        {
          timestamp: '2025-05-08T10:00:00Z',
          nitrogen: 24,
          phosphorus: 14,
          potassium: 19
        },
        {
          timestamp: '2025-05-01T10:00:00Z',
          nitrogen: 23,
          phosphorus: 13,
          potassium: 18
        },
      ],
      optimal: {
        nitrogen: { min: 20, max: 30 },
        phosphorus: { min: 10, max: 20 },
        potassium: { min: 15, max: 25 }
      }
    }
  }
};

// Mock crop data
export const cropData = [
  {
    id: 'crop-1',
    name: 'Wheat',
    fieldId: 'field-1',
    area: 10,
    plantingDate: '2025-03-15',
    expectedHarvestDate: '2025-07-15',
    status: 'growing',
    healthStatus: 'good',
    growth: 65, // percentage
    soilRequirements: {
      ph: { min: 6.0, max: 7.0 },
      moisture: { min: 30, max: 45 },
      temperature: { min: 15, max: 25 }
    },
    estimatedYield: {
      expected: 5.5, // tons per hectare
      current: 5.2 // current estimate
    },
    history: [
      { date: '2025-05-14', growth: 65, health: 'good' },
      { date: '2025-05-07', growth: 55, health: 'good' },
      { date: '2025-04-30', growth: 45, health: 'good' },
      { date: '2025-04-23', growth: 35, health: 'good' },
      { date: '2025-04-16', growth: 25, health: 'good' },
      { date: '2025-04-09', growth: 15, health: 'fair' },
      { date: '2025-04-02', growth: 5, health: 'good' }
    ]
  },
  {
    id: 'crop-2',
    name: 'Corn',
    fieldId: 'field-2',
    area: 15,
    plantingDate: '2025-04-01',
    expectedHarvestDate: '2025-08-15',
    status: 'growing',
    healthStatus: 'warning',
    growth: 45, // percentage
    soilRequirements: {
      ph: { min: 5.8, max: 7.0 },
      moisture: { min: 35, max: 50 },
      temperature: { min: 20, max: 30 }
    },
    estimatedYield: {
      expected: 9.0, // tons per hectare
      current: 8.3 // current estimate
    },
    history: [
      { date: '2025-05-14', growth: 45, health: 'warning' },
      { date: '2025-05-07', growth: 40, health: 'fair' },
      { date: '2025-04-30', growth: 35, health: 'good' },
      { date: '2025-04-23', growth: 25, health: 'good' },
      { date: '2025-04-16', growth: 15, health: 'good' },
      { date: '2025-04-09', growth: 5, health: 'good' }
    ]
  },
  {
    id: 'crop-3',
    name: 'Potatoes',
    fieldId: 'field-3',
    area: 5,
    plantingDate: '2025-04-15',
    expectedHarvestDate: '2025-09-01',
    status: 'growing',
    healthStatus: 'danger',
    growth: 35, // percentage
    soilRequirements: {
      ph: { min: 5.5, max: 6.5 },
      moisture: { min: 40, max: 55 },
      temperature: { min: 15, max: 23 }
    },
    estimatedYield: {
      expected: 25.0, // tons per hectare
      current: 20.5 // current estimate
    },
    history: [
      { date: '2025-05-14', growth: 35, health: 'danger' },
      { date: '2025-05-07', growth: 30, health: 'warning' },
      { date: '2025-04-30', growth: 25, health: 'fair' },
      { date: '2025-04-23', growth: 15, health: 'good' },
      { date: '2025-04-16', growth: 5, health: 'good' }
    ]
  }
];

// Mock weather data
export const weatherData = {
  current: {
    temperature: 22,
    humidity: 65,
    conditions: 'Partly Cloudy',
    windSpeed: 12,
    windDirection: 'NE',
    precipitation: 0,
    timestamp: '2025-05-15T10:00:00Z'
  },
  forecast: [
    {
      date: '2025-05-16',
      temperatureHigh: 24,
      temperatureLow: 16,
      conditions: 'Sunny',
      precipitation: 0,
      humidity: 60,
      windSpeed: 10
    },
    {
      date: '2025-05-17',
      temperatureHigh: 26,
      temperatureLow: 17,
      conditions: 'Clear',
      precipitation: 0,
      humidity: 55,
      windSpeed: 8
    },
    {
      date: '2025-05-18',
      temperatureHigh: 25,
      temperatureLow: 18,
      conditions: 'Partly Cloudy',
      precipitation: 10,
      humidity: 65,
      windSpeed: 12
    },
    {
      date: '2025-05-19',
      temperatureHigh: 23,
      temperatureLow: 17,
      conditions: 'Rain',
      precipitation: 80,
      humidity: 75,
      windSpeed: 15
    },
    {
      date: '2025-05-20',
      temperatureHigh: 21,
      temperatureLow: 16,
      conditions: 'Showers',
      precipitation: 60,
      humidity: 80,
      windSpeed: 18
    }
  ],
  alerts: [
    {
      type: 'drought',
      severity: 'warning',
      message: 'Potential drought conditions in the next 7-10 days',
      startDate: '2025-05-21',
      endDate: '2025-05-31'
    }
  ]
};

// Mock AI recommendations
export const recommendationsData = [
  {
    id: 'rec-1',
    type: 'crop',
    title: 'Rotation culturale recommandée',
    description: 'Basé sur les conditions actuelles du sol, nous recommandons de planter du soja après votre récolte de blé pour restaurer les niveaux d\'azote.',
    priority: 'high',
    date: '2025-05-15',
    actions: [
      'Planifier la plantation de soja pour août 2025',
      'Préparer les semences et engrais appropriés'
    ]
  },
  {
    id: 'rec-2',
    type: 'soil',
    title: 'Traitement du sol recommandé',
    description: 'Les niveaux de phosphore sont légèrement bas. Application d\'engrais phosphaté recommandée dans les 14 jours.',
    priority: 'medium',
    date: '2025-05-15',
    actions: [
      'Appliquer 200kg/ha d\'engrais phosphaté',
      'Mesurer les niveaux après 3 semaines'
    ]
  },
  {
    id: 'rec-3',
    type: 'irrigation',
    title: 'Ajustement d\'irrigation',
    description: 'Compte tenu des prévisions de sécheresse, nous recommandons d\'augmenter l\'irrigation de 15% au cours des deux prochaines semaines.',
    priority: 'high',
    date: '2025-05-15',
    actions: [
      'Augmenter l\'irrigation à 10mm/jour',
      'Surveiller les niveaux d\'humidité du sol quotidiennement'
    ]
  },
  {
    id: 'rec-4',
    type: 'pest',
    title: 'Risque d\'infestation',
    description: 'Risque élevé d\'apparition de pucerons dans les 7 prochains jours en raison des conditions météorologiques. Traitement préventif recommandé.',
    priority: 'medium',
    date: '2025-05-15',
    actions: [
      'Appliquer un traitement préventif biologique',
      'Installer des pièges de surveillance'
    ]
  },
  {
    id: 'rec-5',
    type: 'harvest',
    title: 'Planification de récolte',
    description: 'La récolte de blé est prévue pour le 15 juillet. Compte tenu des conditions actuelles, envisagez de récolter 3-5 jours plus tôt pour éviter les pluies prévues.',
    priority: 'low',
    date: '2025-05-15',
    actions: [
      'Préparer les équipements pour le 10 juillet',
      'Surveiller les prévisions météo pour ajustements'
    ]
  }
];