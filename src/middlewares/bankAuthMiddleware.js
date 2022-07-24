const db = require('../bancodedados');
const bankPassword = db.banco.senha;

const authWithBankPassword = (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) return res.status(400).json({ "mensagem": "Não foi informado nenhuma senha do banco" });

    if (senha_banco !== bankPassword) return res.status(400).json({ "mensagem": "A senha do banco informada é inválida!" });

    next();
}

module.exports = { authWithBankPassword }

