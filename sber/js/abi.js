const abi = [
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_code_word",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "accept_the_transfer",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "get_transfers",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "recipient",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "status_accept",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "end_transfer",
						"type": "bool"
					},
					{
						"internalType": "bytes32",
						"name": "code_word",
						"type": "bytes32"
					}
				],
				"internalType": "struct sber.Transfer[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "refuse_transfer_sender",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_recipient",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "_code_word",
				"type": "bytes32"
			}
		],
		"name": "send_money",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "transfers",
		"outputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "status_accept",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "end_transfer",
				"type": "bool"
			},
			{
				"internalType": "bytes32",
				"name": "code_word",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

export default abi