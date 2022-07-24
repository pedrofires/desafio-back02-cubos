let db = require('../bancodedados');
const { findUserAccount } = require('../utils/validateData');

let idAccount = 1;


const createAccount = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const newAccount = {
        numero: idAccount++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    db.contas.push(newAccount);

    res.status(201).send();
}

const editAccount = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { numeroConta } = req.params;

    const findAccount = findUserAccount(numeroConta);

    findAccount.usuario.nome = nome;
    findAccount.usuario.cpf = cpf;
    findAccount.usuario.data_nascimento = data_nascimento;
    findAccount.usuario.telefone = telefone;
    findAccount.usuario.email = email;
    findAccount.usuario.senha = senha;

    res.status(204).send();
}

const deleteAccount = (req, res) => {
    const { numeroConta } = req.params;

    const findAccount = db.contas.find((account) => {
        return account.numero === Number(numeroConta);
    })

    if (findAccount.saldo === 0) {
        db.contas = db.contas.filter((account) => {
            return account.numero !== Number(numeroConta);
        })
    }

    res.status(203).send()
}

const checkBalance = (req, res) => {
    const { numero_conta } = req.query;

    const accountBalance = findUserAccount(numero_conta).saldo;

    return res.status(200).json({ 'saldo:': `${accountBalance}` })
}

const checkBankStatement = (req, res) => {
    const { numero_conta } = req.query;

    const depositsArray = []
    const withdrawsArray = []
    const transfersSentArray = []
    const transfersReceivedArray = []

    db.depositos.forEach((deposits) => {
        if (deposits.numero_conta === numero_conta) {
            depositsArray.push(deposits);
        }
    })

    db.saques.forEach((withdraws) => {
        if (withdraws.numero_conta === numero_conta) {
            withdrawsArray.push(withdraws);
        }
    })

    db.transferencias.forEach((transfers) => {
        if (transfers.numero_conta_origem === numero_conta) {
            transfersSentArray.push(transfers);
        }
    })

    db.transferencias.forEach((transfers) => {
        if (transfers.numero_conta_destino === numero_conta) {
            transfersReceivedArray.push(transfers);
        }
    })


    const bankStatement = {
        depositos: depositsArray,
        saques: withdrawsArray,
        transferenciasEnviadas: transfersSentArray,
        transferenciasRecebidas: transfersReceivedArray
    }

    return res.status(200).json(bankStatement);
}

module.exports = { createAccount, editAccount, deleteAccount, checkBalance, checkBankStatement };