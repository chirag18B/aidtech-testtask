# AID:Tech

This repository contains a Fabric Chaincode based test task for [AID:Tech](https://aid.technology/).

## Getting Started

The code in this repository has been tested in the following environment:

- Node: `v8.9.3` and `v8.11.4`
- Hyperledger fabric: `v1.2`
- Docker: `18.06.1-ce`
- Python: `2.7.12`
- Go: `go1.9.3 linux/amd64`
- Curl: `7.47.0`

I would recommend using the same version, while adapting/using this code.

Please visit the [installation instructions](http://hyperledger-fabric.readthedocs.io/en/latest/install.html)
to ensure you have the correct prerequisites installed. Please use the
version of the documentation that matches the version of the software you
intend to use to ensure alignment.

After making sure the [prerequisites](https://hyperledger-fabric.readthedocs.io/en/release-1.2/prereqs.html) and [binaries](https://hyperledger-fabric.readthedocs.io/en/release-1.2/install.html#) are installed properly, follow the following steps:

```sh
cd path/to/repository/folder
cd network
```

Once you are in the network folder you can start setting up AID:Tech network environment.

## Housekeeping and Bringing the Network Down

If it's your second time running this test task, or you have run any other HyperLedger Fabric based code, first run the following commands:

```sh
./aidtech_network.sh down
```

It will ask for a confirmation:

```sh
Stopping for channel 'aidtechchannel' with CLI timeout of '10' seconds and CLI delay of '3' seconds
Continue? [Y/n]
```

Press `Y` and continue.

You can also use the above commands to bring down the network, everytime before restarting it.

> Note: You can always check how many containers, volumes and networks of docker are up and running, using the following commands:

- `docker ps`
- `docker volume ls`
- `docker network ls`

If you have problems in shutting down containers and volumes using the script, try running the following commands:

- `docker network prune`
- `docker volume prune`
- `docker rm -f $(docker ps -aq)`
- `docker system prune`

## Network Setup

Once you're done with the Housekeeping, you are ready to start your network, use the following commands:

```sh
./aidtech_network.sh up
Starting for channel 'aidtechchannel' with CLI timeout of '10' seconds and CLI delay of '3' seconds
Continue? [Y/n] Y
...
```

It may take some time to execute (usually between 60- 120 seconds, to execute). But if you see the following log in your terminal it executed successfully, and your network is ready to use.

```sh
========= All GOOD, execution completed ===========
 _____   _   _   ____
| ____| | \ | | |  _ \
|  _|   |  \| | | | | |
| |___  | |\  | | |_| |
|_____| |_| \_| |____/

```

It created the required certificates for each entity of HyperLedger using the `crypto-config.yaml` file, in a folder named `crypto-config` within your networks directory. Check it out!

It also created `channel.tx`, `genesis.block`.

## Calling getter functions within the chaincode

When you start the network, you automatically bring up the 2 Orgs:

- orgone.aidtech.com
- orgtwo.aidtech.com
  You also create a public channel between them and instantiate Donation Manager Chaincode on that channel. Now, we can call getter functions using the CLI. To enter the CLI, use the following command:

```sh
docker exec -it cli bash
```

Here you can fire following getter commands:

### readDonation

Can be used to read the data stored for any Donation ID.

```sh
peer chaincode query -C aidtechchannel -n donation-manager-chaincode -c '{"Args":["readDonation","929cd618f0c6598eddaff18fa8ffab809ce1f35cb31a3270aa1fc80f1f92b85b"]}'

// Expected Output format if ID not created:
{"key":"929cd618f0c6598eddaff18fa8ffab809ce1f35cb31a3270aa1fc80f1f92b85b","value":null}

// Expected Output format if ID created:
{"key":"929cd618f0c6598eddaff18fa8ffab809ce1f35cb31a3270aa1fc80f1f92b85b","value":{"project":"ITU","itemType":"toys","amount":1,"timestamp":{"seconds":{"low":1551102037,"high":0,"unsigned":false},"nanos":512532845},"validity":true}}
```

### readMultipleDonations

Can be used to read the data for multiple donation IDs.

```sh
peer chaincode query -C aidtechchannel -n donation-manager-chaincode -c '{"Args":["readMultipleDonations","929cd618f0c6598eddaff18fa8ffab809ce1f35cb31a3270aa1fc80f1f92b85b", "8fefcd410881962355a6366f9394f44e68496065b91b5ab0cffcda94fed565c5", "7d0a59f560e88b7f8e1019353bb38786b8f981e6a62b9cc54204314591f4380r"]}'

// Expected Output Format:
{"929cd618f0c6598eddaff18fa8ffab809ce1f35cb31a3270aa1fc80f1f92b85b":{"key":"929cd618f0c6598eddaff18fa8ffab809ce1f35cb31a3270aa1fc80f1f92b85b","value":{"project":"ITU","itemType":"toys","amount":1,"timestamp":{"seconds":{"low":1551102037,"high":0,"unsigned":false},"nanos":512532845},"validity":true}},"8fefcd410881962355a6366f9394f44e68496065b91b5ab0cffcda94fed565c5":{"key":"8fefcd410881962355a6366f9394f44e68496065b91b5ab0cffcda94fed565c5","value":null},"7d0a59f560e88b7f8e1019353bb38786b8f981e6a62b9cc54204314591f4380r":{"key":"7d0a59f560e88b7f8e1019353bb38786b8f981e6a62b9cc54204314591f4380r","value":null}}
```

### isPresent

Can be used to check if a Donation ID is present or not.

```sh
peer chaincode query -C aidtechchannel -n donation-manager-chaincode -c '{"Args":["isPresent","929cd618f0c6598eddaff18fa8ffab809ce1f35cb31a3270aa1fc80f1f92b85b"]}'

// Expected Output if present:
{"exists":true}

// Expected Output if absent:
{"exists":false}
```

### getHistoryForDonation

Gets the create/update/delete history for a particular donation ID.

```sh
peer chaincode query -C aidtechchannel -n donation-manager-chaincode -c '{"Args":["getHistoryForDonation","929cd618f0c6598eddaff18fa8ffab809ce1f35cb31a3270aa1fc80f1f92b85b"]}'

// Expected Output:
[{"TxId":"929cd618f0c6598eddaff18fa8ffab809ce1f35cb31a3270aa1fc80f1f92b85b","Timestamp":{"seconds":{"low":1551102037,"high":0,"unsigned":false},"nanos":512532845},"IsDelete":"false","Value":{"project":"ITU","itemType":"toys","amount":1,"timestamp":{"seconds":{"low":1551102037,"high":0,"unsigned":false},"nanos":512532845},"validity":true}},{"TxId":"7b678194c1ac43ef2519e818f6c8bae292f7a6e10178d3b1e8e9a30c626c3918","Timestamp":{"seconds":{"low":1551102781,"high":0,"unsigned":false},"nanos":25354489},"IsDelete":"false","Value":{"project":"ITU","itemType":"grains","amount":1,"timestamp":{"seconds":{"low":1551102781,"high":0,"unsigned":false},"nanos":25354489},"validity":true}},{"TxId":"965615284efe78c9df5994909548b6d3f72326b875a815278017c57fd74c0739","Timestamp":{"seconds":{"low":1551102798,"high":0,"unsigned":false},"nanos":411077463},"IsDelete":"true","Value":""}]
```

## Calling setter functions within the chaincode

Setter functions require endorsement according to the endorsement policy set during chaincode instantiation, in our case it requires at least one endorsement from each Org individually.

The Setter functions are as follows:

### addDonation

addDonation function represents creation of a donation. Storing the required project, item type and amount params along with validity and timestamp (transaction time stamp), against a unique transaction ID produced by Fabric.

```sh
CREATE1='{"Args":["addDonation", "ITU", "toys", "1"]}'

peer chaincode invoke -o orderer.aidtech.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/aidtech.com/orderers/orderer.aidtech.com/msp/tlscacerts/tlsca.aidtech.com-cert.pem -C aidtechchannel -n donation-manager-chaincode --peerAddresses peer0.orgone.aidtech.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgone.aidtech.com/peers/peer0.orgone.aidtech.com/tls/ca.crt --peerAddresses peer0.orgtwo.aidtech.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgtwo.aidtech.com/peers/peer0.orgtwo.aidtech.com/tls/ca.crt -c "$CREATE1"

// expected output format
2019-02-25 14:01:26.237 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200 payload:"{\"donationId\":\"684a1b9eb44ce9925af5227be06ecf458b8fa34e7b4c374d7f766c5a50426aaf\"}" 
```

### updateDonation

updateDonation function representing update of a given donation ID. The first argument passed should be a donation ID, following the keys to be updated (could be: project, itemType and amount) and the new updated values. This will recalculate the validity and timestamp for the donation.

```sh
peer chaincode invoke -o orderer.aidtech.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/aidtech.com/orderers/orderer.aidtech.com/msp/tlscacerts/tlsca.aidtech.com-cert.pem -C aidtechchannel -n donation-manager-chaincode --peerAddresses peer0.orgone.aidtech.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgone.aidtech.com/peers/peer0.orgone.aidtech.com/tls/ca.crt --peerAddresses peer0.orgtwo.aidtech.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgtwo.aidtech.com/peers/peer0.orgtwo.aidtech.com/tls/ca.crt -c '{"Args":["updateDonation", "684a1b9eb44ce9925af5227be06ecf458b8fa34e7b4c374d7f766c5a50426aaf", "itemType", "grains"]}'

// expected output format
2019-02-25 14:05:06.112 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200 payload:"{\"donationId\":\"684a1b9eb44ce9925af5227be06ecf458b8fa34e7b4c374d7f766c5a50426aaf\",\"updateTx\":\"845effc052dbbcf0be8cfe300a908e1285fdbe11c17c36ccc5985456ee949e4c\"}" 
```

### removeDonation

Deletes a donation entity for a given ID from state.

```sh

peer chaincode invoke -o orderer.aidtech.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/aidtech.com/orderers/orderer.aidtech.com/msp/tlscacerts/tlsca.aidtech.com-cert.pem -C aidtechchannel -n donation-manager-chaincode --peerAddresses peer0.orgone.aidtech.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgone.aidtech.com/peers/peer0.orgone.aidtech.com/tls/ca.crt --peerAddresses peer0.orgtwo.aidtech.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/orgtwo.aidtech.com/peers/peer0.orgtwo.aidtech.com/tls/ca.crt -c '{"Args":["removeDonation", "684a1b9eb44ce9925af5227be06ecf458b8fa34e7b4c374d7f766c5a50426aaf"]}'

// expected output format
2019-02-25 14:08:05.430 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200 payload:"{\"donationId\":\"684a1b9eb44ce9925af5227be06ecf458b8fa34e7b4c374d7f766c5a50426aaf\",\"deleteTx\":\"4b765927153f1bc9cd51b0166020a6ffe0384255a71776d94c168ea8543c2692\"}" 
```

## Debugging:

To see debugging logs related to chaincode use:

```sh
docker logs -f dev-peer0.orgone.aidtech.com-donation-manager-chaincode-1.0

OR

docker logs -f dev-peer0.orgtwo.aidtech.com-donation-manager-chaincode-1.0
```
