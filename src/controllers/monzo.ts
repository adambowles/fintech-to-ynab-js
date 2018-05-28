import * as ynab from 'ynab';
import * as moment from 'moment';
require('dotenv').config();

import GenericController from './generic';

interface MonzoTransaction {
  type: string;
  data: {
    account_id: string;
    amount: number;
    local_amount: number;
    created: string;
    currency: string;
    local_currency: string;
    description: string;
    id: string;
    category: string;
    is_load: boolean;
    settled: boolean;
    notes: string;
    merchant: {
      address: {
        address: string;
        city: string;
        country: string;
        latitude: number;
        longitude: number;
        postcode: string;
        region: string;
      };
      created: string;
      group_id: string;
      id: string;
      logo: string;
      emoji: string;
      name: string;
      category: string;
    };
    counterparty: {
      name: string;
    };
    metadata: {
      is_topup: boolean;
    };
  };
}

export default class MonzoController extends GenericController {
  public constructor(transaction: MonzoTransaction) {
    console.log(
      'Received Monzo transaction:',
      JSON.stringify(transaction, undefined, '  '),
    );

    let payee_name = transaction.data.description;
    let memo = '';
    if (transaction.data.merchant) {
      payee_name = transaction.data.merchant.name;
    }
    if (transaction.data.counterparty) {
      payee_name = transaction.data.counterparty.name;
      memo = transaction.data.notes;
    }
    if (transaction.data.metadata.is_topup) {
      payee_name = 'Topup';
    }

    let flag_color: ynab.TransactionDetail.FlagColorEnum;
    if (process.env.FOREIGN_CURRENCY_APPLY_FLAG) {
      if (transaction.data.local_currency !== 'GBP') {
        flag_color =
          ynab.TransactionDetail.FlagColorEnum[
            process.env
              .FOREIGN_CURRENCY_APPLY_FLAG as keyof typeof ynab.TransactionDetail.FlagColorEnum
          ];

        const { local_currency } = transaction.data;
        let { local_amount } = transaction.data;
        local_amount = local_amount * 10;

        memo = `(${transaction.data.local_amount} ${local_currency}) ${memo}`;
      }
    }

    super({
      account_id: process.env.YNAB_MONZO_ACCOUNT_ID,
      amount: transaction.data.amount * 10,
      // category_name: string,
      date: moment(transaction.data.created).toISOString(),
      flag_color,
      memo,
      payee_name,
    });
  }
}
