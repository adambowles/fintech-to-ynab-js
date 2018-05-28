import * as ynab from 'ynab';
import * as moment from 'moment';
require('dotenv').config();

import GenericController from './generic';

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

export default class StarlingController extends GenericController {
  public constructor(transaction: StarlingTransaction) {
    console.log(
      'Received Starling transaction:',
      JSON.stringify(transaction, undefined, '  '),
    );
    let memo: string;
    if (transaction.content.reference) {
      memo = transaction.content.reference;
    }

    let flag_color: ynab.TransactionDetail.FlagColorEnum;
    if (process.env.FOREIGN_CURRENCY_APPLY_FLAG) {
      if (transaction.content.sourceCurrency !== 'GBP') {
        flag_color =
          ynab.TransactionDetail.FlagColorEnum[
            process.env
              .FOREIGN_CURRENCY_APPLY_FLAG as keyof typeof ynab.TransactionDetail.FlagColorEnum
          ];

        // TODO does Starling give local currency amount?
        memo = `(${transaction.content.sourceCurrency}) ${memo}`;
      }
    }

    super({
      account_id: process.env.YNAB_STARLING_ACCOUNT_ID,
      amount: transaction.content.amount * 1000,
      // category_name: string,
      date: moment(transaction.timestamp).toISOString(),
      flag_color,
      memo,
      payee_name: transaction.content.counterParty,
    });
  }
}
