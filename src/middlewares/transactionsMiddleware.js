let db = require('../bancodedados');

const { findUserAccount } = require('../utils/validateData');

const validateDeposit = (req, res, next) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || isNaN(Number(numero_conta)) || !valor || isNaN(Number(valor)))
        return res.status(400).json({ "mensagem": "O número da conta e o valor são obrigatórios!" })

    const isAccountExist = findUserAccount(numero_conta);

    if (!isAccountExist) return res.status(404).json({ "mensagem": "Esta conta não existe!" })

    if (Number(valor) <= 0) return res.status(400).json({ "mensagem": "Não é possível depositar um valor menor ou igual a 0!" })

    next();
}

const validateCashWithdraw = (req, res, next) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || isNaN(Number(numero_conta)) || !valor || isNaN(Number(valor)) || !senha)
        return res.status(400).json({ "mensagem": "O número da conta, valor e senha são obrigatórios!" })

    if (Number(valor) <= 0)
        return res.status(400).json({ "mensagem": "Não é possível sacar um valor menor ou igual a 0!" })

    const isAccountExist = findUserAccount(numero_conta);

    if (!isAccountExist) {
        return res.status(404).json({ "mensagem": "Esta conta não existe!" })
    } else {
        if (isAccountExist.usuario.senha !== senha) {
            return res.status(400).json({ "mensagem": "Senha Incorreta!" })
        } else if (isAccountExist.saldo < Number(valor)) {
            return res.status(400).json({ "mensagem": "Saldo indisponível" })
        }
    }

    next();
}
const validateTransfer = (req, res, next) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || isNaN(Number(numero_conta_origem)) || !numero_conta_destino || isNaN(Number(numero_conta_destino)))
        return res.status(400).json({ "mensagem": "O número da conta de origem e de destino são obrigatórias!" })

    if (!valor || isNaN(Number(valor)) || !senha)
        return res.status(400).json({ "mensagem": "O número da conta, valor e senha são obrigatórios!" })

    if (Number(valor) <= 0)
        return res.status(400).json({ "mensagem": "Não é possível transferir um valor menor ou igual a 0!" })

    const isAccountExist = findUserAccount(numero_conta_origem);

    const isTargetAccountExist = findUserAccount(numero_conta_destino);

    if (!isTargetAccountExist)
        return res.status(404).json({ "mensagem": "Conta de destino não existe!" })

    if (!isAccountExist) {
        return res.status(404).json({ "mensagem": "Conta de origem não existe!" })
    } else {
        if (isAccountExist.usuario.senha !== senha) {
            return res.status(400).json({ "mensagem": "Senha Incorreta!" })
        } else if (isAccountExist.saldo < Number(valor)) {
            return res.status(400).json({ "mensagem": "Saldo indisponível" })
        }
    }

    next();

}

module.exports = { validateDeposit, validateCashWithdraw, validateTransfer }