let contract;
let web3;
let accounts; 




async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    document.getElementById("connectWallet").innerHTML = "Connected";
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  } else {
    document.getElementById("connectWallet").innerHTML =
      "Please install MetaMask";
  }
}
 
async function enterLottery() {
	if (typeof window.ethereum !== "undefined") {
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
    <script type="module"></script>
import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      await contract.enter();
	  document.getElementById('enterLottery').addEventListener('click', () => {
		contract.methods.enter().send({ from: accounts[0], value: web3.utils.toWei("0.01", "ether") })
			.then(() => {
				// Display success message on the HTML page
				document.getElementById('responseMessage').innerText = "You have entered the lottery!";
				console.log("Entered the lottery!");
			})
			.catch(error => {
				// Handle error and optionally display an error message on the HTML page
				console.error(error);
				document.getElementById('responseMessage').innerText = "Failed to enter the lottery. Please check the console for details.";
			});
	});
	try {
		// Assume you have entered the lottery before retrieving participants
		await contract.methods.enter().send({ from: accounts[0] });
	
		// Get participants after entering the lottery
		const participants = await contract.methods.getParticipants().call();
		displayParticipants(participants);
	} catch (error) {
		console.error("Error getting participants:", error.message);
		// Optionally, display an error message on the HTML page or take other actions
	}
	
	function displayParticipants(participants) {
		const participantsList = document.getElementById('participantsList');
		participantsList.innerHTML = participants.map(address => `<li>${address}</li>`).join('');
	}
	
	
	 document.getElementById('pickWinner').addEventListener('click', async () => {
		try {
			const result = await contract.methods.pickWinner().send({ from: accounts[0] });
			console.log("Winner picked!", result);
			displayWinner(result); // Call a function to display the winner
		} catch (error) {
			console.error("Error picking winner:", error.message);
			// Optionally, display an error message on the HTML page or take other actions
		}
	});
	
	function displayWinner(winner) {
		// Get the winnerDisplay element
		const winnerDisplay = document.getElementById('winnerDisplay');
	
		// Update the content of the winnerDisplay element
		winnerDisplay.innerHTML = `<p>Winner: ${winner}</p>`;
	}
	</script>
module.exports = {
  connect,
  enterLottery,
  pickWinner,
};
    }
