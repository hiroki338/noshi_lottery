const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";
const abi = [
    {
        "inputs": [],
        "name": "enter",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pickWinner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "participant",
                "type": "address"
            }
        ],
        "name": "ParticipantEntered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "winner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "WinnerPicked",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "getParticipants",
        "outputs": [
            {
                "internalType": "address payable[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "manager",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "participants",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
 
let contract;
let web3;
let accounts;
 

 
function initApp() {
    contract = new web3.eth.Contract(abi, contractAddress);


 
    document.getElementById('enterLottery').addEventListener('click', () => {
        contract.methods.enter().send({ from: accounts[0], value: web3.utils.toWei("0.01", "ether") })
        .then(() => console.log("Entered the lottery!"))
        .catch(console.error);
    });
 
    document.getElementById('pickWinner').addEventListener('click', () => {
        contract.methods.pickWinner().send({ from: accounts[0] })
        .then(() => console.log("Winner picked!"))
        .catch(console.error);
    });
 
    // Fetch and display participants
    contract.methods.getParticipants().call()
    .then(displayParticipants)
    .catch(console.error);
 
function displayParticipants(participants) {
    const participantsList = document.getElementById('participantsList');
    participantsList.innerHTML = participants.map(address => `<li>${address}</li>`).join('');}
}
