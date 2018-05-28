import * as ynab from 'ynab';

require('dotenv').config();

import AbstractController from './abstract';

interface StarlingTransaction {
  content: {
    amount: number;
    sourceCurrency: string;
    forCustomer: string;
    counterParty: string;
    reference: string;
    transactionUid: string;
    type:
      | 'INTEREST_CHARGE'
      | 'SCHEDULED_PAYMENT_CANCELLED'
      | 'SCHEDULED_PAYMENT_INSUFFICIENT_FUNDS'
      | 'TRANSACTION_CARD'
      | 'TRANSACTION_CASH_WITHDRAWAL'
      | 'TRANSACTION_MOBILE_WALLET'
      | 'TRANSACTION_DIRECT_CREDIT'
      | 'TRANSACTION_DIRECT_DEBIT'
      | 'TRANSACTION_DIRECT_DEBIT_INSUFFICIENT_FUNDS'
      | 'TRANSACTION_DIRECT_DEBIT_DISPUTE'
      | 'TRANSACTION_FASTER_PAYMENT_IN'
      | 'TRANSACTION_FASTER_PAYMENT_OUT'
      | 'TRANSACTION_FASTER_PAYMENT_REVERSAL'
      | 'TRANSACTION_INTEREST_PAYMENT'
      | 'TRANSACTION_INTERNAL_TRANSFER'
      | 'TRANSACTION_NOSTRO_DEPOSIT'
      | 'TRANSACTION_INTEREST_WAIVED_DEPOSIT'
      | 'TRANSACTION_STRIPE_FUNDING'
      | 'TRANSACTION_DECLINED_INSUFFICIENT_FUNDS'
      | 'TRANSACTION_AUTH_DECLINED'
      | 'TRANSACTION_AUTH_PARTIAL_REVERSAL'
      | 'TRANSACTION_AUTH_FULL_REVERSAL';
    merchantUid: string;
    merchantLocationUid: string;
    customerUid: string;
  };
  timestamp: string;
  uid: string;
}

export default class StarlingController extends AbstractController {
  public constructor(transaction: StarlingTransaction) {
    super();

    console.log(
      'Received Monzo transaction:',
      JSON.stringify(transaction, undefined, '  '),
    );

    this.account_id = process.env.YNAB_STARLING_ACCOUNT_ID;
    this.amount = transaction.content.amount * 1000;
    this.date = transaction.timestamp;
    this.payee_name = this.determinePayeeName(transaction);

    if (transaction.content.reference) {
      this.memo = transaction.content.reference;
    }

    let flag_color: ynab.TransactionDetail.FlagColorEnum;
    if (process.env.FOREIGN_CURRENCY_APPLY_FLAG) {
      if (transaction.content.sourceCurrency !== 'GBP') {
        this.flag_color =
          ynab.TransactionDetail.FlagColorEnum[
            process.env
              .FOREIGN_CURRENCY_APPLY_FLAG as keyof typeof ynab.TransactionDetail.FlagColorEnum
          ];

        // TODO does Starling give local currency amount?
        this.memo = `(${transaction.content.sourceCurrency}) ${this.memo}`;
      }
    }
  }

  private readonly determinePayeeName = (
    transaction: StarlingTransaction,
  ): string => {
    return transaction.content.counterParty;
  };
}
