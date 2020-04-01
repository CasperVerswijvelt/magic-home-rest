
# Magic-Home REST API
Simple REST API to control magic-home lights on the same network, built with [magic-home](https://github.com/jangxx/node-magichome) and [express](https://expressjs.com/).

## Get devices

Gets a list of magic-home devices on the network

**URL** : `/api/devices/`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

### Success Response

**Code** : `200 OK`

**Content example**

```json
[
  {
    "address": "192.168.69.198",
    "id": "F4CFA2120867",
    "model": "AK001-ZJ2101"
  }
]
```

## Get device state

Gets a the state of a magic-home device, by it's id

**URL** : `/api/device/:id`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

### Success Response

**Code** : `200 OK`

**Content example**

```json5 
{
  "type": 51,
  "on": true,
  "mode": "color",
  "speed": 66.66666666666667,
  "color": {
    "red": 255,
    "green": 255,
    "blue": 0
  },
  "warm_white": 0,
  "cold_white": 0
}
```
## Change color

Change the color of a magic-home device, by it's address or id.

**URL** : `/api/color/`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : None

**Data constraints**

If no id or address is provided, all lights on the network will receive this change.

```json5 
{
    "id": "id of magic-home device, string, optional",
    "address": "address of magic-home device, string, optional",
    "color": "color to change to, string (hex) or number (decimal), required",
    "brightness": "brightness to adjust the color with, number, optional"
}
```

**Data example** All fields must be sent.

```json5 
{
    "id": "F4CFA2120867",
    "address": "192.168.69.198",
    "color": "#FF0000", // or "FF0000" or 16711680
    "brightness": "100"
}
```

### Success Response

**Condition** : Color commands were sent

**Code** : `200 OK`
