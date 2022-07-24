let db = require('../bancodedados');

function checkReqBody(nome, cpf, data_nascimento, telefone, email, senha) {
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha)
        return true;
}

function checkCpfEmail(cpf, email) {
    for (const account of db.contas) {
        if (account.usuario.cpf === cpf || account.usuario.email === email) {
            return true;
        }
    }
}

function findUserAccount(numeroConta) {
    const findAccount = db.contas.find(account => {
        return account.numero === Number(numeroConta);
    })
    return findAccount;
}

module.exports = { checkCpfEmail, checkReqBody, findUserAccount };