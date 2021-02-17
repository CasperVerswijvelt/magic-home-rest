const { Control, Discovery } = require('magic-home');
const express = require("express");
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000

let devices = []

function scanDevices() {
    console.log('Scanning for devices ...')
    Discovery.scan(1000).then(d => {
        devices = d
        let s = d.length == 1 ? "" : "s"
        console.log(`Found ${d.length} device${s}`)
        devices.forEach(element => {
            console.log(element)
        });
    })
}

scanDevices();
setInterval(scanDevices, 60000);

const app = express();
app.use(bodyParser());
app.use(function (err, req, res, next) {
    if (err) {

        res.status(500).send('Something went wrong!')

    } else {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*'); // http://localhost:8888

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();

    }
});

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

app.post("/api/color", (req, res) => {

    try {

        let color = req.body.color;
        let brightness = req.body.brightness ? req.body.brightness : 100;
        let id = req.body.id;
        let address = req.body.address;

        if (typeof color === 'undefined') {
            res.status('500').send('Color must be defined');
            return;
        }

        let r = 255, g = 255, b = 255;

        if (typeof color === 'number') {

            let c = req.body.color
            let r = Math.floor(c / (256 * 256));
            let g = Math.floor(c / 256) % 256;
            let b = c % 256;

        } else if (typeof color === 'string') {

            let rgb = hexToRgb(color);

            if (rgb == null) throw "Couldn't parse color string"
            r = rgb.r;
            g = rgb.g;
            b = rgb.b;

        }

        let localDevices = devices.filter(device => (id === undefined || device.id === id) && (address === undefined || device.address === address))
        let promises = []
        localDevices.forEach(device => {
            let control = new Control(device.address, {
                wait_for_reply: false,

            })
            promises.push(control.setColorWithBrightness(r, g, b, brightness))
        })
        
        Promise.all(promises).then(() => res.sendStatus('200'))

    } catch (e) {
        res.status(500).send(e)
        console.log(e)
    }

});

app.post("/api/power", (req, res) => {

    try {

        let id = req.body.id;
        let address = req.body.address;
        let power = req.body.power

        if (typeof power === 'undefined') {
            res.status('500').send('Power state must be defined');
            return;
        }

        if (typeof power === 'boolean') {

            let c = req.body.color
            let r = Math.floor(c / (256 * 256));
            let g = Math.floor(c / 256) % 256;
            let b = c % 256;

        } else {

            res.status('500').send('Power value must be boolean');

        }

        let localDevices = devices.filter(device => (id === undefined || device.id === id) && (address === undefined || device.address === address))
        let promises = []
        localDevices.forEach(device => {
            let control = new Control(device.address, {
                wait_for_reply: false,

            })
            promises.push(control.setPower(power))
        })

        Promise.all(promises).then(() => res.sendStatus('200'))

    } catch (e) {
        res.status(500).send(e)
        console.log(e)
    }

});

app.get("/api/devices", (req, res) => {
    res.json(devices)
})

app.get("/api/device/:id", (req, res) => {

    let id = req.params.id;
    if (typeof id === 'undefined') {
        res.status(500).send('Id must be defined!');
        return;
    }

    let device = devices.find(element => element.id === id)

    if (device === undefined) {
        res.status(500).send(`No device with id ${id} was found`)
        return;
    }

    new Control(device.address).queryState().then(state => {
        res.json(state);
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
