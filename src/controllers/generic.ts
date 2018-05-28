import * as ynab from 'ynab';
require('dotenv').config();

export default class GenericController {
  public readonly ynab: ynab.api;
  public readonly transaction: ynab.SaveTransaction;

  constructor(transaction: ynab.SaveTransaction) {
    this.ynab = new ynab.API(process.env.YNAB_ACCESS_TOKEN);

    // Fuck me Microsoft, this is ugly
    let cleared: ynab.TransactionDetail.ClearedEnum =
      ynab.TransactionDetail.ClearedEnum[
        'uncleared' as keyof typeof ynab.TransactionDetail.ClearedEnum
      ];
    if (process.env.AUTO_CLEAR && process.env.AUTO_CLEAR !== 'false') {
      cleared =
        ynab.TransactionDetail.ClearedEnum[
          'cleared' as keyof typeof ynab.TransactionDetail.ClearedEnum
        ];
    }

    transaction.cleared = cleared;

    const baseMemo = process.env.APPLY_MEMO || '';

    // if (transaction.flag_color) {
    transaction.memo = `(${transaction.memo}) ${baseMemo}`.trim();
    // } else {
    //   transaction.memo = baseMemo;
    // }

    this.transaction = transaction;
  }

  public async createTransaction(): Promise<ynab.SaveTransaction> {
    const transaction: ynab.SaveTransactionWrapper = {
      transaction: this.transaction,
    };

    console.log(
      'Creating transaction:',
      JSON.stringify(transaction, undefined, '  '),
    );

    try {
      await this.ynab.transactions.createTransaction(
        process.env.YNAB_BUDGET_ID,
        transaction,
      );

      return this.transaction;
    } catch (error) {
      throw error;
    }
  }
}
