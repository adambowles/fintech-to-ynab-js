import * as ynab from 'ynab';
import * as moment from 'moment';
require('dotenv').config();

import GenericController from './generic';

interface StarlingTransaction {
  webhookNotificationUid: string;
  customerUid: string;
  webhookType:
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
  eventUid: string;
  transactionAmount: {
    currency: string;
    minorUnits: number;
  };
  sourceAmount: {
    currency: string;
    minorUnits: number;
  };
  direction: 'PAYMENT' | 'REFUND';
  description: string;
  merchantUid: string;
  merchantLocationUid: string;
  status: 'PENDING' | 'SETTLED';
  transactionMethod:
    | 'CONTACTLESS'
    | 'MAGNETIC_STRIP'
    | 'MANUAL_KEY_ENTRY'
    | 'CHIP_AND_PIN'
    | 'ONLINE'
    | 'ATM'
    | 'APPLE_PAY'
    | 'ANDROID_PAY'
    | 'OTHER_WALLET'
    | 'NOT_APPLICABLE'
    | 'UNKNOWN';
  transactionTimestamp: string;
  // merchantPosData
  timestamp: string;
}

// const exampleStarlingTransaction: StarlingTransaction = {
//   webhookNotificationUid: 'fc075558-9511-4e77-a196-99a8107af2b4',
//   customerUid: 'fc075558-9511-4e77-a196-99a8107af2b4',
//   webhookType: 'TRANSACTION_CARD',
//   eventUid: 'fc075558-9511-4e77-a196-99a8107af2b4',
//   transactionAmount: {
//     currency: 'GBP',
//     minorUnits: 11223344,
//   },
//   sourceAmount: {
//     currency: 'GBP',
//     minorUnits: 11223344,
//   },
//   direction: 'PAYMENT',
//   description: 'Description',
//   merchantUid: 'fc075558-9511-4e77-a196-99a8107af2b4',
//   merchantLocationUid: 'fc075558-9511-4e77-a196-99a8107af2b4',
//   status: 'PENDING',
//   transactionMethod: 'CONTACTLESS',
//   transactionTimestamp: '2017-06-05T11:47:58.801Z',

//   // merchantPosData
//   timestamp: '2017-06-05T11:47:58.801Z',
// };

export default class StarlingController extends GenericController {
  public constructor(transaction: StarlingTransaction) {
    console.log('Starling transaction:', transaction);
    let amount = transaction.transactionAmount.minorUnits;
    if (transaction.direction === 'REFUND') {
      amount = -amount;
    }

    super({
      account_id: process.env.YNAB_STARLING_ACCOUNT_ID,
      amount,
      date: moment(transaction.transactionTimestamp).toISOString(),
      memo: process.env.APPLY_MEMO || '',
      payee_name: transaction.description,
      // cleared: ynab.TransactionDetail.ClearedEnum['cleared'],
      // flag_color: ynab.TransactionDetail.FlagColorEnum['blue'],
    });
    // category_name: string,
  }
}
