let db = require('../bancodedados');

const { checkCpfEmail, checkReqBody, findUserAccount } = require('../utils/validateData');


const validateNewAccount = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const isMissingValue = checkReqBody(nome, cpf, data_nascimento, telefone, email, senha);
    const isCpfEmailExist = checkCpfEmail(cpf, email);

    if (isMissingValue)
        return res.status(400).json({ "mensagem": "Um ou mais campos está faltando" })

    if (isCpfEmailExist)
        return res.status(400).json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" })

    next();
}

const validateEditAccount = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { numeroConta } = req.params;

    const isMissingValue = checkReqBody(nome, cpf, data_nascimento, telefone, email, senha);
    const isCpfEmailExist = checkCpfEmail(cpf, email);
    const isAccountExist = findUserAccount(numeroConta);

    if (!numeroConta || isNaN(Number(numeroConta)))
        return res.status(400).json({ "mensagem": "Número da conta não foi informado" })

    //duplicado
    if (!isAccountExist) return res.status(404).json({ "mensagem": "Esta conta não existe" })

    if (isMissingValue)
        return res.status(400).json({ "mensagem": "Um ou mais campos está faltando" })

    if (isCpfEmailExist)
        return res.status(400).json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" })

    next();
}

const validateDeleteAccount = (req, res, next) => {
    const { numeroConta } = req.params;
    const isAccountExist = findUserAccount(numeroConta);

    if (!numeroConta || isNaN(Number(numeroConta)))
        return res.status(400).json({ "mensagem": "Número da conta não foi informado" })

    if (!isAccountExist) return res.status(404).json({ "mensagem": "Esta conta não existe" })

    if (isAccountExist.saldo !== 0) {
        return res.status(403).json({ "mensagem": "A conta só pode ser removida se o saldo for zero!" })
    }

    next();
}

const validateAccountAcess = (req, res, next) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || isNaN(Number(numero_conta)) || !senha)
        return res.status(400).json({ "mensagem": "O número da conta, valor e senha são obrigatórios!" })

    const isAccountExist = findUserAccount(numero_conta);

    if (!isAccountExist) {
        return res.status(404).json({ "mensagem": "Esta conta não existe!" })
    } else {
        if (isAccountExist.usuario.senha !== senha) {
            return res.status(400).json({ "mensagem": "Senha Incorreta!" })
        }
    }

    next();
}



module.exports = { validateNewAccount, validateEditAccount, validateDeleteAccount, validateAccountAcess };