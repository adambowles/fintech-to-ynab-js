import * as ynab from 'ynab';
require('dotenv').config();

export default class GenericController {
  public readonly ynab: ynab.api;
  public readonly transaction: ynab.SaveTransaction;

  constructor(transaction: ynab.SaveTransaction) {
    this.ynab = new ynab.API(process.env.YNAB_ACCESS_TOKEN);
    this.transaction = transaction;
  }

  public async createTransaction(): Promise<ynab.SaveTransaction> {
    try {
      await this.ynab.transactions
        .createTransaction(process.env.YNAB_BUDGET_ID, {
          transaction: this.transaction,
        });

      return this.transaction;
    } catch (error) {
      throw error;
    }
  }
}
