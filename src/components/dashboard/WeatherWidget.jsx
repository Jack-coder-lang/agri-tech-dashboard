import { Cloud, Sun, CloudRain } from "lucide-react"

const WeatherWidget = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Aujourd'hui</h3>
          <p className="text-3xl font-bold">22°C</p>
          <p className="text-sm text-gray-500">Partiellement nuageux</p>
        </div>
        <Cloud className="h-12 w-12 text-gray-400" />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2">
          <Sun className="h-6 w-6 mx-auto text-yellow-500" />
          <p className="text-xs mt-1">Demain</p>
          <p className="font-semibold">25°C</p>
        </div>
        <div className="p-2">
          <CloudRain className="h-6 w-6 mx-auto text-blue-500" />
          <p className="text-xs mt-1">Mercredi</p>
          <p className="font-semibold">18°C</p>
        </div>
        <div className="p-2">
          <Sun className="h-6 w-6 mx-auto text-yellow-500" />
          <p className="text-xs mt-1">Jeudi</p>
          <p className="font-semibold">24°C</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between text-sm">
          <span>Humidité</span>
          <span>65%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Vent</span>
          <span>12 km/h</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Pression</span>
          <span>1013 hPa</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherWidget
