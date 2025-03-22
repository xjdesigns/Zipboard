export const MOCK = {
  permissionRequest: true,
  state: 'PoweredOn',
  devices: [
    {
      device: {
        name: 'My Device',
        id: '11111',
        localName: 'Friendly Name',
        isConnectable: true,
        _haveDeviceFail: false
      },
      service: {
        id: '22222',
        uuid: '22222',
        deviceID: '11111'
      },
      characteristics: [
        {
          id: '33333',
          uuid: '33333',
          serviceID: '22222',
          serviceUUID: '22222',
          deviceID: '11111',
          isReadable: true,
          isWritableWithResponse: true,
          isWritableWithoutResponse: true,
          value: 'Something'
        }
      ]
    }
  ]
}
