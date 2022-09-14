
# Magic-Home REST API

![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/casperverswijvelt/magic-home-rest) ![Docker Pulls](https://img.shields.io/docker/pulls/casperverswijvelt/magic-home-rest) ![example workflow](https://github.com/CasperVerswijvelt/magic-home-rest/actions/workflows/build-docker.yml/badge.svg)

Simple REST API to control magic-home lights on the same network, built with [magic-home](https://github.com/jangxx/node-magichome) and [express](https://expressjs.com/).

## How to run

### Via docker

- Pull the latest version using  `docker pull casperverswijvelt/magic-home-rest:latest`
- Run the image using `docker run --net=host --env PORT=3001 casperverswijvelt/magic-home-rest` (Customize port to your liking)

### Manually

- Clone this repository
- Make sure NPM/Node is installed
- Run `npm ci`
- Run `npm start`

## API

### Get devices

Gets a list of magic-home devices on the network

**URL** : `/api/devices/`

**Method** : `GET`

#### Success Response

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

### Get device state

Gets a the state of a magic-home device, by it's id

**URL** : `/api/device/:id`

**Method** : `GET`

#### Success Response

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
### Change color

Change the color of a magic-home device, by it's address or id.

**URL** : `/api/color/`

**Method** : `POST`

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

**Data example**

```json5
{
    "id": "F4CFA2120867",
    "address": "192.168.69.198",
    "color": "#FF0000", // or "FF0000" or 16711680
    "brightness": "100"
}
```

#### Success Response

**Condition** : Color commands were sent

**Code** : `200 OK`

### Turn on/off

Change the power state of a magic-home device, by it's address or id.

**URL** : `/api/power/`

**Method** : `POST`

**Data constraints**

If no id or address is provided, all lights on the network will receive this change.

```json5
{
    "id": "id of magic-home device, string, optional",
    "address": "address of magic-home device, string, optional",
    "power": "power state to set, required"
}
```

**Data example**

```json5
{
    "id": "F4CFA2120867",
    "address": "192.168.69.198",
    "power": false
}
```

#### Success Response

**Condition** : Power commands were sent

**Code** : `200 OK`

### Activate an effect

Activate an effect on a magic-home device, by it's address or id.

**URL** : `/api/effect/`

**Method** : `POST`

**Data constraints**

If no id or address is provided, all lights on the network will receive this change.

See [this repository](https://github.com/jangxx/node-magichome#built-in-patterns) for a list of patterns.

```json5
{
    "id": "id of magic-home device, string, optional",
    "address": "address of magic-home device, string, optional",
    "effect": "effect pattern to set, required",
    "speed": "speed of the effect, number of 1 - 100, optional"
}
```

**Data example**

```json5
{
    "id": "F4CFA2120867",
    "address": "192.168.69.198",
    "effect": "seven_color_cross_fade",
    "speed": 50
}
```

### Success Response

**Condition** : Effect commands were sent

**Code** : `200 OK`

