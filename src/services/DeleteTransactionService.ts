import { getCustomRepository } from 'typeorm';
import AppError from "../errors/AppError";
import { isUuid } from 'uuidv4';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
	id: string
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
		if (!isUuid(id)) {
			throw new AppError('Invalid ID');
		}

		const transactionRepository = getCustomRepository(TransactionRepository);
		const transaction = await transactionRepository.findOne(id);

		if (!transaction) {
			throw new AppError(
				'Transact not exist', 400
			)
		}

		await transactionRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
