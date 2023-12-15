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
 
let contract;
let web3;
let accounts;
 
    async function initApp() {
        // Check if the web3 object is available
        if (typeof window.ethereum !== "undefined") {
            if (typeof Web3 === "undefined") {
                const Web3 = require("web3");
                web3 = new Web3(window.ethereum);
            } else {
                web3 = new Web3(window.ethereum);
            }   
            accounts = await web3.eth.getAccounts();
            contract = new web3.eth.Contract(abi, contractAddress);
    
        }

    document.getElementById('enterLottery').addEventListener('click', () => {
        if (typeof web3 !== "undefined" && typeof accounts !== "undefined") {
            contract.methods.enter().send({ from: accounts[0], value: web3.utils.toWei("0.01", "ether") })
                .then(() => {
                    console.log("Entered the lottery!");
                    updateParticipantsList(); // Display participants after each new entry
                })
                .catch(console.error);
        } else {
            console.error("Web3 not available. Please install MetaMask or another Ethereum provider.");
        }
    });
 
    document.getElementById('pickWinner').addEventListener('click', () => {
        contract.methods.pickWinner().send({ from: accounts[0] })
            .then(() => {
                console.log("Winner picked!");
                displayWinner(); // Display the winner
                updateParticipantsList(); // Update participants after picking the winner
            })
            .catch(console.error);
    });
 
    // Function to display participants in the browser HTML
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
}
initApp();
