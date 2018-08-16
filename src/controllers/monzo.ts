import * as currency from 'currency-formatter';
import * as ynab from 'ynab';

require('dotenv').config();

import AbstractController from './abstract';

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

export default class MonzoController extends AbstractController {
  public constructor(transaction: MonzoTransaction) {
    super();

    console.log(
      'Received Monzo transaction:',
      JSON.stringify(transaction, undefined, '  '),
    );

    this.account_id = process.env.YNAB_MONZO_ACCOUNT_ID;
    this.amount = transaction.data.amount * 10;
    this.date = transaction.data.created;
    this.payee_name = this.determinePayeeName(transaction).substr(0, 50);

    if (transaction.data.counterparty) {
      this.memo = transaction.data.notes;
    }

    if (transaction.data.local_currency !== 'GBP') {
      const local_amount = currency.format(
        Math.abs(transaction.data.local_amount / 100),
        {
          code: transaction.data.local_currency,
        },
      );

      this.memo = `(${local_amount} ${transaction.data.local_currency}) ${
        this.memo
      }`;

      if (process.env.FOREIGN_CURRENCY_APPLY_FLAG) {
        this.flag_color =
          ynab.TransactionDetail.FlagColorEnum[
            process.env
              .FOREIGN_CURRENCY_APPLY_FLAG as keyof typeof ynab.TransactionDetail.FlagColorEnum
          ];
      }
    }
  }

  private readonly determinePayeeName = (
    transaction: MonzoTransaction,
  ): string => {
    try {
      return transaction.data.merchant.name;
    } catch (error) {}

    try {
      return transaction.data.counterparty.name;
    } catch (error) {}

    if (transaction.data.metadata.is_topup) {
      return 'Topup';
    }

    return transaction.data.description;
  };
}
