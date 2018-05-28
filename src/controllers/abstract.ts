import * as moment from 'moment';
import * as ynab from 'ynab';

require('dotenv').config();

export default abstract class AbstractController {
  private readonly ynab: ynab.api;

  public account_id: string;
  public amount: number;
  // public category_id: string;
  public cleared: ynab.TransactionDetail.ClearedEnum;
  public date: string;
  public flag_color: ynab.TransactionDetail.FlagColorEnum;
  public memo: string;
  public payee_name: string;

  constructor() {
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
    this.cleared = cleared;

    if (!this.flag_color && process.env.DOMESTIC_CURRENCY_APPLY_FLAG) {
      let flag_color: ynab.TransactionDetail.FlagColorEnum;
      flag_color =
        ynab.TransactionDetail.FlagColorEnum[
          process.env
            .DOMESTIC_CURRENCY_APPLY_FLAG as keyof typeof ynab.TransactionDetail.FlagColorEnum
        ];

      this.flag_color = flag_color;
    }

    this.memo = process.env.APPLY_MEMO || '';
  }

  public async createTransaction(): Promise<ynab.SaveTransaction> {
    const transaction: ynab.SaveTransaction = {
      account_id: this.account_id,
      amount: this.amount,
      // category_id: this.category_id,
      cleared: this.cleared,
      date: moment(this.date).toISOString(),
      flag_color: this.flag_color,
      memo: this.memo.replace(/\s+/g, ' ').trim(),
      payee_name: this.payee_name,
    };

    console.log(
      'Creating transaction:',
      JSON.stringify(transaction, undefined, '  '),
    );

    try {
      await this.ynab.transactions.createTransaction(
        process.env.YNAB_BUDGET_ID,
        {
          transaction,
        },
      );

      return transaction;
    } catch (error) {
      throw error;
    }
  }
}
