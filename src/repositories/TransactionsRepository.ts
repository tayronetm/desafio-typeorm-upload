import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance() {
		const transactions = await this.find();

		const findIncome = transactions.filter(transaction => {
			return transaction.type === 'income'
		});

		const findOutcome = transactions.filter(transaction => {
			return transaction.type === 'outcome'
		});

		const income = findIncome.reduce((acumulator, currentValue) => {
			return acumulator + Number(currentValue.value);
		}, 0)

		const outcome = findOutcome.reduce((acumulator, currentValue) => {
			return acumulator + Number(currentValue.value);
		}, 0)

		const total = income - outcome;

		const balance = {
      income,
      outcome,
      total,
    };

    return balance;

  }
}

export default TransactionsRepository;