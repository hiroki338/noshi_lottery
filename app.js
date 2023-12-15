let web3;
let accounts;
let contract;

async function initApp() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        accounts = await web3.eth.getAccounts();
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
                    "inputs": [],
                    "name": "getLastWinner",
                    "outputs": [
                        {
                            "internalType": "address payable",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
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
                    "name": "lastWinner",
                    "outputs": [
                        {
                            "internalType": "address payable",
                            "name": "",
                            "type": "address"
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
        contract = new web3.eth.Contract(abi, contractAddress);
    } else {
        console.error("Web3 not available. Please install MetaMask or another Ethereum provider.");
    }
}

async function connect() {
    await initApp();
    if (accounts && accounts.length > 0) {
        const truncatedAddress = `${accounts[0].slice(0, 5)}...${accounts[0].slice(-5)}`;
        document.getElementById("connectWallet").innerText = `Connected (${truncatedAddress})`;
        document.getElementById("connectWallet").disabled = true;
    }
}

async function enterLottery() {
    if (web3 && accounts && accounts.length > 0) {
        await contract.methods.enter().send({ from: accounts[0], value: web3.utils.toWei("0.01", "ether") });
        console.log("Entered the lottery!");
        updateParticipantsList();
    } else {
        console.error("Web3 not available. Please connect your wallet.");
    }
}

async function pickWinner() {
    if (web3 && accounts && accounts.length > 0) {
        await contract.methods.pickWinner().send({ from: accounts[0] });
        console.log("Winner picked!");
        displayWinner();
        updateParticipantsList();
    } else {
        console.error("Web3 not available. Please connect your wallet.");
    }
}

function updateParticipantsList() {
    contract.methods.getParticipants().call()
        .then(displayParticipants)
        .catch(console.error);
}

function displayWinner() {
    contract.methods.getLastWinner().call()
        .then(winner => {
            const winnerElement = document.getElementById('winner');
            winnerElement.innerHTML = `<p>Winner: ${winner}</p>`;
        })
        .catch(console.error);
}

function displayParticipants(participants) {
    const participantsList = document.getElementById('participantsList');
    participantsList.innerHTML = participants.map(address => `<li>${address}</li>`).join('');
}

initApp();
