import abi from "./abi.js";

const contractAddress = "0xbB80eD9c95924FeEd7d8Aa4fD304e3f95207f49c";
let myContract, web3, accounts, currentAccount;

async function getTransactions() {
    let divTr = document.querySelector('.divTr')
    if (divTr) {
        divTr.remove()
    }

    let divTrSend = document.querySelector('.divTrSend')
    if (divTrSend) {
        divTrSend.remove()
    }

    getTransfersToAccpt(await getTransfers())
    getTrSender(await getTransfers())
    document.querySelector('.balance').textContent = 'Баланс кошелька:' + ' ' + await web3.eth.getBalance(document.getElementById("toggle").value)/10**18 + ' ' + 'Eth'
}

async function getAccounts() {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    
    accounts = await web3.eth.getAccounts();
    
    currentAccount = accounts[0];
    getTransfersToAccpt(await getTransfers())

    // Список
    let selectElement = document.getElementById("toggle");
    let selEl = document.getElementById('transferSel')

    let accnts = accounts

    for (let i = 0; i < accnts.length; i++) {
        let address = document.createElement("option");

        address.text = accnts[i];
        selEl.add(address)
    }

    for (let i = 0; i < accnts.length; i++) {
        let address = document.createElement("option");

        address.text = accnts[i];
        selectElement.add(address);
    }
    document.querySelector('.balance').textContent = 'Баланс кошелька:' + ' ' + await web3.eth.getBalance(selectElement.value)/10**18 + ' ' + 'Eth'

    selectElement.addEventListener("change", async () => {
        document.querySelector('.balance').textContent = 'Баланс кошелька:' + ' ' + await web3.eth.getBalance(selectElement.value)/10**18 + ' ' + 'Eth'
        currentAccount = selectElement.value

        getTransactions()
    })

    document.querySelector('.transferBtn').addEventListener('click', async () => {
        let accTo = document.getElementById('transferSel')
        let selectedAcc = accTo.options[accTo.selectedIndex]
        let valueToTransfer = document.querySelector('.valueTransfer')
        let codeWrd = document.querySelector('.codeWord')      
    
        if (valueToTransfer.value < 0 || valueToTransfer.value > await web3.eth.getBalance(selectElement.value)/10**18) {
            alert("Неккоректное число")
        } else if (codeWrd.value.trim() === '') {
            alert("Ввеите кодовое слово")
        } else if (selectedAcc.value == currentAccount) {
            alert("Вы не можете переводить деньги самому себе")
        } else if (valueToTransfer.value.slice(-1) == "." || valueToTransfer.value.includes('..')) {
            alert('Неправильная расстановка точек в сумме для перевода.')
        } else {
            transferMoney(currentAccount, selectedAcc.value, valueToTransfer.value, codeWrd.value)
            // getTrSender(await getTransfers())
            getTransactions()
            valueToTransfer.value = ''
            codeWrd.value = ''
        }
    })
}

function getTrSender(arr) {
    const divTr = document.createElement('div')
    divTr.classList.add('divTrSend')

    for (let i = 0;  i < arr[0].length; i++) {
        
        if (currentAccount == arr[0][i].sender && !arr[0][i].end_transfer) {
            let transactions = document.createElement('div')
            transactions.classList.add('acptDiv')
    
            let recipient = document.createElement('h3')
            recipient.textContent = arr[0][i].recipient
            recipient.id = i
        
            let sum = document.createElement('p')
            sum.textContent = arr[0][i].amount/10**18 + ' ' + 'Eth'

            let trCancel = document.createElement('button')
            trCancel.classList.add('trCancel')
            trCancel.textContent = "Отменить перевод"
            trCancel.addEventListener('click', async (e) => {
                if (confirm("Вы действительно хотите отменить перевод?")) {
                    cancelTransfer(currentAccount, e.target.parentNode.firstElementChild.id)
                    alert("Транзакция отменена")

                    getTransactions()
                }
            })

            transactions.append(recipient, sum, trCancel)
            divTr.append(transactions)
        }
    }

    document.querySelector('.sentTransfers').append(divTr)
}

async function cancelTransfer(currentAcc,idTr) {

    const cancellTransaction = await myContract.methods.refuse_transfer_sender(idTr).send({
        from: currentAcc,
        to: currentAcc,
        gas: 1000000
    })
}

function getTransfersToAccpt(arr) {
    // Переводы для принятия
    const divTr = document.createElement('div')
    divTr.classList.add('divTr')
 
    for (let i = 0;  i < arr[0].length; i++) {
        
        if (currentAccount == arr[0][i].recipient && !arr[0][i].end_transfer) {
            let acptDiv = document.createElement('div')
            acptDiv.classList.add('acptDiv')
    
            let sender = document.createElement('h3')
            sender.textContent = arr[0][i].sender
            sender.id = i
        
            let sum = document.createElement('p')
            sum.textContent = arr[0][i].amount/10**18 + ' ' + 'Eth'

            let acptBtnTrnsfr = document.createElement('button')
            acptBtnTrnsfr.classList.add('acptBtnTrnsfr')
            acptBtnTrnsfr.textContent = "Принять"
            acptBtnTrnsfr.addEventListener('click', (e) => {
                
                if (document.querySelector('.acptInpCdWrd').firstElementChild != null) {
                    document.querySelector('.acptInpCdWrd').firstElementChild.remove()
                    document.querySelector('.acptInpCdWrd').firstElementChild.remove()
                }

                let cdWrdInp = document.createElement('input')
                cdWrdInp.classList.add('acptCodeWordInp')
                cdWrdInp.placeholder = 'Введите кодовое слово'

        
                let acptBtnTrnsfr = document.createElement('button')
                acptBtnTrnsfr.classList.add('acptBtnTr')
                acptBtnTrnsfr.textContent = "Принять"

                document.querySelector('.acptInpCdWrd').append(cdWrdInp, acptBtnTrnsfr)
        
                acptBtnTrnsfr.addEventListener('click', () => {
                    acceptTransfer(currentAccount, e.target.parentNode.firstElementChild.id, cdWrdInp.value)
                })
            })
                
            acptDiv.append(sender, sum, acptBtnTrnsfr)
            divTr.append(acptDiv)
        }
    }

    document.querySelector('.accept').append(divTr)      
}

async function transferMoney (urAccount, account, money, codeWord) {
    let finalCodeWord = web3.utils.sha3(codeWord)

    const transfer = await myContract.methods.send_money(account, finalCodeWord).send({
        from: urAccount,
        to: contractAddress,
        value: web3.utils.toWei(money, 'ether'),
        gas: 1000000
    })
}

async function getTransfers() {
    const allTransfers = []

    allTransfers[allTransfers.length] = await myContract.methods.get_transfers().call({
        from: web3.eth.accounts[0],
        gas: 10000000
    })

    return allTransfers
}

async function acceptTransfer(urAccount, idTransfer, codeWr) {
    let codeWord = ""

    await getTransfers().then((transfers) => {
        codeWord = transfers[0][idTransfer].code_word
    }).then()

    console.log(codeWord);

    let convertedCodeWord = web3.utils.sha3(codeWr)

    console.log(convertedCodeWord);

    if(convertedCodeWord == codeWord) {
        const get = await myContract.methods.accept_the_transfer(convertedCodeWord, idTransfer).send({
            from: web3.utils.toChecksumAddress(urAccount),
            to: urAccount,
            gas: 6000000
        }).then(async (receipt) => {
            alert("Транзакция прошла успешно!")
            location.reload()

            // document.querySelector('.balance').textContent = 'Баланс кошелька:' + ' ' + await web3.eth.getBalance(document.getElementById("toggle").value)/10**18 + ' ' + 'Eth'
        })
        return true
    } 
    else {
        alert("Неверное кодовое слово! Транзакция не прошла!");
        return false;
    }
}

getAccounts()

myContract = new web3.eth.Contract(abi, contractAddress)