import { Router } from 'express';
import multer from 'multer';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import { getCustomRepository } from 'typeorm';

import uploadConfig from '../config/upload';
import ImportTransactionsService from '../services/ImportTransactionsService';
const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
	const transactionRepository = getCustomRepository(TransactionsRepository);
	const transactions = await transactionRepository.find();
	const balance = await transactionRepository.getBalance();

	return response.json({ transactions, balance});
});

transactionsRouter.post('/', async (request, response) => {
	const { title, value, type, category } = request.body;
	const createTransaction = new CreateTransactionService();
	const transaction = await createTransaction.execute({
		title,
		value,
		type,
		category
	})

	return response.json(transaction);
	
});

transactionsRouter.delete('/:id', async (request, response) => {
	const { id } = request.params;
	
	const deleteTransaction = new DeleteTransactionService();
	await deleteTransaction.execute({ id });

	return response.status(204).send()
});

transactionsRouter.post('/import',upload.single('file'), async (request, response) => {
	const { path } = request.file;

	const importTransacation = new ImportTransactionsService();

	const transactions = await importTransacation.execute(path);

	return response.json(transactions);
});

export default transactionsRouter;
