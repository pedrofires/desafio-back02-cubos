let db = require('../bancodedados');

const showAllAccounts = (req, res) => {
    res.status(200).send(db.contas);
}

module.exports = { showAllAccounts };
