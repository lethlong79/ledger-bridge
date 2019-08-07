import "babel-polyfill";
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import NemH from "./hw-app-nem";
import { TransportStatusError } from "@ledgerhq/errors";

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 21335;

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
            throw "Can not recognize your request!!!"
    }
}

async function getAccount(hdKeypath, network, label) {
    const transport = await TransportNodeHid.open("");
    const nemH = new NemH(transport);

    return new Promise(async(resolve, reject) => {
        nemH.getAddress(hdKeypath)
        .then(result => {
            transport.close();
            resolve(
                {
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
                }
            );
        })
        .catch( err => {
            transport.close();
            reject(err);
        })
    })

}

async function signTransaction(hdKeypath, serializedTx) {
    const transport = await TransportNodeHid.open("");
    const nemH = new NemH(transport);

    return new Promise(async(resolve, reject) => {
        nemH.signTransaction(hdKeypath, serializedTx)
        .then(sig => {
            transport.close();
            resolve(sig.signature);
        })
        .catch( err => {
            transport.close();
            reject(err);
        })
    })
}