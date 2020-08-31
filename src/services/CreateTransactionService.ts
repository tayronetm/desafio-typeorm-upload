
import { getRepository, getCustomRepository } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
	title: string;
	value: number;
	type: 'income' | 'outcome';
	category: string;
}


class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {

		const transactionRepository = getCustomRepository(TransactionsRepository);
		const categoriesRepository = getRepository(Category);
		if (type === 'outcome') {
			const { total } = await transactionRepository.getBalance();

			if (total - value < 0) {
				throw new AppError('Operation not allowed')
			}
		}

		let transactionCategory = await categoriesRepository.findOne({
			where: { title: category }
		})

		if (!transactionCategory) {
			transactionCategory = categoriesRepository.create({
				title: category
			});
			await categoriesRepository.save(transactionCategory);
		}

		const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

		await transactionRepository.save(transaction);

		return transaction;


  }
}

export default CreateTransactionService;
