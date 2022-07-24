const express = require('express')


const { authWithBankPassword } = require('./middlewares/bankAuthMiddleware');

const { validateNewAccount, validateEditAccount, validateDeleteAccount, validateAccountAcess } = require('./middlewares/accountMiddleware');

const { validateDeposit, validateTransfer, validateCashWithdraw } = require('./middlewares/transactionsMiddleware');


const { makeDeposit, makeCashWithdraw, makeTransfer } = require('./controllers/transactionsController.js');

const { showAllAccounts } = require('./controllers/bankController');

const { createAccount, editAccount, deleteAccount, checkBalance, checkBankStatement } = require('./controllers/accountController');


const routes = express();

routes.get('/contas', authWithBankPassword, showAllAccounts);

routes.post('/contas', validateNewAccount, createAccount);
routes.put('/contas/:numeroConta/usuario', validateEditAccount, editAccount);
routes.delete('/contas/:numeroConta', validateDeleteAccount, deleteAccount);
routes.get('/contas/saldo', validateAccountAcess, checkBalance);
routes.get('/contas/extrato', validateAccountAcess, checkBankStatement);

routes.post('/transacoes/depositar', validateDeposit, makeDeposit);
routes.post('/transacoes/sacar', validateCashWithdraw, makeCashWithdraw);
routes.post('/transacoes/transferir', validateTransfer, makeTransfer);



module.exports = routes;