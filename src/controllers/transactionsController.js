let db = require('../bancodedados');
const { format } = require('date-fns')

const { findUserAccount } = require('../utils/validateData');


const makeDeposit = (req, res) => {
    const { numero_conta, valor } = req.body;
    const account = findUserAccount(numero_conta);

    account.saldo += valor;

    const date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const receipt = {
        date,
        numero_conta,
        valor
    }

    db.depositos.push(receipt);

    return res.status(204).send();
}
const makeCashWithdraw = (req, res) => {
    const { numero_conta, valor } = req.body;

    const account = findUserAccount(numero_conta);

    account.saldo -= valor;

    const date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const receipt = {
        date,
        numero_conta,
        valor
    }

    db.saques.push(receipt);

    return res.status(204).send();
}
const makeTransfer = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor } = req.body;

    const accountOrigin = findUserAccount(numero_conta_origem);
    accountOrigin.saldo -= valor;

    const accountTarget = findUserAccount(numero_conta_destino);
    accountTarget.saldo += valor;

    const date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const receipt = {
        date,
        numero_conta_origem,
        numero_conta_destino,
        valor
    }

    db.transferencias.push(receipt);

    return res.status(204).send();
}


module.exports = { makeDeposit, makeCashWithdraw, makeTransfer };
