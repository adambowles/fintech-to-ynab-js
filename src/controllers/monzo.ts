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

// const exampleMonzoTransaction: MonzoTransaction = {
//   type: 'transaction.created',
//   data: {
//     account_id: 'acc_00008gju41AHyfLUzBUk8A',
//     amount: -350,
//     created: '2015-09-04T14:28:40Z',
//     currency: 'GBP',
//     description: 'Ozone Coffee Roasters',
//     id: 'tx_00008zjky19HyFLAzlUk7t',
//     category: 'eating_out',
//     is_load: false,
//     settled: true,
//     merchant: {
//       address: {
//         address: '98 Southgate Road',
//         city: 'London',
//         country: 'GB',
//         latitude: 51.54151,
//         longitude: -0.08482400000002599,
//         postcode: 'N1 3JD',
//         region: 'Greater London',
//       },
//       created: '2015-08-22T12:20:18Z',
//       group_id: 'grp_00008zIcpbBOaAr7TTP3sv',
//       id: 'merch_00008zIcpbAKe8shBxXUtl',
//       logo:
//         'https://pbs.twimg.com/profile_images/527043602623389696/68_SgUWJ.jpeg',
//       emoji: '🍞',
//       name: 'The De Beauvoir Deli Co.',
//       category: 'eating_out',
//     },
//   },
// };

export default class MonzoController extends GenericController {
  public constructor(transaction: MonzoTransaction) {
    console.log(
      'Received Monzo transaction:',
      JSON.stringify(transaction, undefined, '  '),
    );

    let payee_name = transaction.data.description;
    if (transaction.data.merchant) {
      payee_name = transaction.data.merchant.name;
    }
    if (transaction.data.counterparty) {
      payee_name = transaction.data.counterparty.name;
    }
    if (transaction.data.metadata.is_topup) {
      payee_name = 'Topup';
    }

    let flag_color: ynab.TransactionDetail.FlagColorEnum;
    let memo: string;
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

        memo = `${transaction.data.local_amount} ${local_currency}`;
      }
    }

    super({
      account_id: process.env.YNAB_MONZO_ACCOUNT_ID,
      amount: transaction.data.amount * 10,
      date: moment(transaction.data.created).toISOString(),
      flag_color,
      memo,
      payee_name,
    });
    // category_name: string,
  }
}
