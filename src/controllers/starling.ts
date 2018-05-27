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

const exampleStarlingTransaction: StarlingTransaction = {
  content: {
    amount: -24.99,
    sourceCurrency: 'GBP',
    forCustomer: '£-24.99 @ Starling Bank',
    counterParty: 'Starling Bank',
    transactionUid: 'fc075558-9511-4e77-a196-99a8107af2b4',
    type: 'TRANSACTION_CARD',
    merchantUid: 'fc075558-9511-4e77-a196-99a8107af2b4',
    merchantLocationUid: 'fc075558-9511-4e77-a196-99a8107af2b4',
    customerUid: 'fc075558-9511-4e77-a196-99a8107af2b4',
  },
  timestamp: '2017-06-05T11:47:58.801Z',
  uid: 'fc075558-9511-4e77-a196-99a8107af2b4',
};

export default class StarlingController extends GenericController {
  public constructor(transaction: StarlingTransaction) {
    console.log('Starling transaction:', transaction);
    super({
      account_id: process.env.YNAB_STARLING_ACCOUNT_ID,
      amount: transaction.content.amount * 1000,
      date: moment(transaction.timestamp).toISOString(),
      memo: process.env.APPLY_MEMO || '',
      payee_name: transaction.content.counterParty,
      // cleared: ynab.TransactionDetail.ClearedEnum['cleared'],
      // flag_color: ynab.TransactionDetail.FlagColorEnum['blue'],
    });
    // category_name: string,
  }
}
