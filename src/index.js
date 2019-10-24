// @ts-ignore
import Axios from 'axios'
import dotenv from 'dotenv'

const { OPEN_WEATHER_API_KEY } = dotenv.config().parsed
const apiKey = '&appid=' + OPEN_WEATHER_API_KEY
const keyName = 'noop'

/**
 * Clase para obtener el clima según la ciudad usando el API https://openweathermap.org
 */
class Weather {
  // Campos privados
  #state
  #endpoint = 'https://api.openweathermap.org/data/2.5/weather?q='
  // Campos Públicos
  city
  [keyName] = 'noop'

  constructor(city) {
    this.city = city
  }

  async updateWeather() {
    const endpoint = this.#endpoint
    const { city } = this
    const url = `${endpoint}${city}${apiKey}&units=metric`
    this.#state = (await Axios.get(url)).data
  }

  getCoord() {
    const { coord } = this.#state
    // const { #state: state } = this;
    return coord
  }

  getTemperature() {
    const { temp } = this.#state.main
    return `${temp} °C`
  }
}

const tokyoWeather = new Weather('Tokyo')

tokyoWeather.updateWeather().then(async () => {
  /**
   * NO podemos acceder a los campos privados desde fuera de la clase #doohhh
   */
  console.group('========= Nice Try =========')
  console.log(`City es un campo público: ${tokyoWeather.city}`)
  // Esto provocará error Unexpected character '#'
  // console.log(tokyoWeather.#state)
  // console.log(tokyoWeather.#endpoint)
  console.groupEnd()

  /**
   * En cambios exponemos solo lo que el usuario final necesita saber.
   */
  console.group('========= Weather of Tokyo =========')
  console.log(`City es un campo público: ${tokyoWeather.city}`)
  console.log(
    `Las variables computadas funcionan para los campos públicos: ${tokyoWeather.noop}`
  )
  console.log(tokyoWeather.getCoord())
  console.log(tokyoWeather.getTemperature())
  console.groupEnd()

  /**
   * Recordemos que los campos públicos son mutables
   */
  tokyoWeather.city = 'London'
  await tokyoWeather.updateWeather()
  console.group('========= Weather of London =========')
  console.log(`City es un campo público: ${tokyoWeather.city}`)
  console.log(tokyoWeather.getCoord())
  console.log(tokyoWeather.getTemperature())
  console.groupEnd()

  /**
   * Destructurado,
   * Posible en campos públicos
   * Probablemente a futuro en campos privados
   */
  let { city: ciudad } = tokyoWeather
  console.group('========= Extras =========')
  console.log(`City es un campo público: ${ciudad}`)
  console.groupEnd()
})
