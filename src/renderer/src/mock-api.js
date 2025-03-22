import axios from 'axios'
const BASE_URL = 'http://localhost:3000'
const BASE_WS_URL = 'ws://localhost:3000'

export function XBLEManager({ stateTimer = 5000 } = {}) {
  return {
    stateTimer,
    stateWS: new WebSocket(`${BASE_WS_URL}/state`),
    deviceWS: new WebSocket(`${BASE_WS_URL}/startDeviceScan`),

    // Using this method to reassign back on itself
    destroy() {
      return null
    },

    enable() {
      // This could be interesting, its a promise that only succeeds when state changes
      // Blocks for Android with PoweredOn state
      // I could just set the device state with an API call which updates the file
      // or else make a hook on itself to allow the user to flip it with Simulator???
    },

    // State will come from saved file from App through API call to endpoint
    state: 'PoweredOff',

    onStateChange(fn) {
      const that = this

      this.stateWS.onmessage = function (event) {
        const state = event.data
        this.state = state
        fn && fn(state)
      }

      this.stateWS.send('ws:initial')

      setTimeout(() => {
        this.stateWS.send('ws:end')
      }, this.stateTimer)

      return {
        remove() {
          that.stateWS.send('ws:close')
        }
      }
    },

    startDeviceScan(_, __, fn) {
      // Websocket call to get data from App file
      // if App file specifies an error send along or else success
      const error = ''
      // const device = { name: 'TI BLE Sensor Tag', ...deviceConstructor }

      // On Device return it sends back 1 by 1...
      // Increment timer 1 second for every device
      this.deviceWS.onmessage = function (event) {
        const payload = JSON.parse(event.data)
        const len = payload.length

        for (let i = 0; i < len; i++) {
          const time = parseInt(`${i}000`)
          setTimeout(() => {
            const d = createDevice(payload[i])
            fn(error, d)
          }, time)
        }
      }

      this.deviceWS.send('ws:open')
    },

    // This will call the API endpoint to stop the websocket
    stopDeviceScan() {
      this.deviceWS.send('ws:close')
    },

    async isDeviceConnected (deviceId) {
      const device = await getAPI(`${BASE_URL}/device?deviceId=${deviceId}`)
      console.warn('deivce connected', device)
      return device?.data?.device?.isConnected ?? false
    },

    async servicesForDevice (deviceId, serviceUUID) {
      const device = await getAPI(`${BASE_URL}/device?deviceId=${deviceId}`)
      return getDeviceServices(device?.data, deviceId, serviceUUID)
    },

    async descriptorsForDevice (deviceId, serviceUUID, characteristicUUID) {
      const device = await getAPI(`${BASE_URL}/device?deviceId=${deviceId}`)
      return getDeviceDescriptors(device?.data, deviceId, serviceUUID, characteristicUUID)
    },

    async readCharacteristicForDevice(deviceId, serviceUUID, characteristicUUID) {
      // const device = await axios.get(`${BASE_URL}/device?deviceId=${deviceId}`)
      const device = await getAPI(`${BASE_URL}/device?deviceId=${deviceId}`)
      return getDeviceCharacteristic(device?.data, deviceId, serviceUUID, characteristicUUID)
    },

    async writeCharacteristicWithResponseForDevice(
      deviceId,
      serviceUUID,
      characteristicUUID,
      base64Value,
      transactionId
    ) {
      // const device = await axios.get(`${BASE_URL}/device?deviceId=${deviceId}`)
      const device = await getAPI(`${BASE_URL}/device?deviceId=${deviceId}`)
      return getDeviceCharacteristic(device?.data, deviceId, serviceUUID, characteristicUUID)
    }
  }
}

function createDevice(data) {
  return {
    ...data.device,
    ...deviceConstructor
  }
}

const deviceConstructor = {
  connect() {
    // this needs to return a promise
    // TODO: Check this to see if we allow connect, if not throw
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(this)
      }, 4000)
    })
  },

  // Take the device from the file and return back that dataset
  async discoverAllServicesAndCharacteristics() {
    const device = await axios.get(`${BASE_URL}/device?deviceId=${this.id}`)
    return device?.data
  }
}

function getDeviceServices (data, deviceId, serviceUUID) {
  const services = data.service.filter((dc) => {
    return (
      dc.deviceID === deviceId && dc.uuid === serviceUUID
    )
  })
  return services.length > 0 ? services : []
}

function getDeviceCharacteristic(data, deviceId, serviceUUID, characteristicUUID) {
  const characteristic = data.characteristics.filter((dc) => {
    return (
      dc.deviceID === deviceId && dc.serviceUUID === serviceUUID && dc.uuid === characteristicUUID
    )
  })
  return characteristic.length > 0 ? characteristic[0] : {}
}

function getDeviceDescriptors (data, deviceId, serviceUUID, characteristicUUID) {
  const characteristic = getDeviceCharacteristic(data, deviceId, serviceUUID, characteristicUUID)
  console.warn('characteristic', characteristic)
  return characteristic.descriptors ?? []
}

function getAPI(path = '') {
  return fetch(path)
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      return {
        data
      }
    })
    .catch((error) => console.error('Error:', error))
}

// Per the docs this would be checking for Android on the permissions layer,
// Move this to a help function since it is outside the scope of the package???
export async function requestBluetoothPermission() {
  // Api call to localhost:3000 server from App
  return true
}
