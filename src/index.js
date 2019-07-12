import "babel-polyfill";
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import NemH from "./hw-app-nem";

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Enabling CORS on Node JS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.listen(port);

app.post('/', async(req, res) => {
    solveRequest(req.body)
        .then(result => res.send(result))
        .catch(result => res.send(result))
});

async function solveRequest(req) {
    switch (req.requestType) {
        case "getAddress":
            return getAccount(req.hdKeypath, req.network, req.label);
        case "signTransaction":
            return signTransaction(req.hdKeypath, req.serializedTx);
        default:
            console.log("3")
    }
}

async function getAccount(hdKeypath, network, label) {
    const transport = await TransportNodeHid.create()
        .catch(err => {
            throw err.message;
        });

    const nemH = new NemH(transport);

    let result = await nemH.getAddress(hdKeypath)
        .catch(err => {
            throw err;
        });
    return ({
        "brain": false,
        "algo": "ledger",
        "encrypted": "",
        "iv": "",
        "address": result.address,
        "label": label,
        "network": network,
        "child": "",
        "hdKeypath": hdKeypath,
        "publicKey": result.publicKey
    })
}

async function signTransaction(hdKeypath, serializedTx) {
    const transport = await TransportNodeHid.create()
        .catch(err => {
            throw err.message;
        });

    const nemH = new NemH(transport);

    let sig = await nemH.signTransaction(hdKeypath, serializedTx)
        .catch(err => {
            throw err;
        });

    return sig.signature;
}