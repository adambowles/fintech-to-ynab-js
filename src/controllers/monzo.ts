import * as ynab from 'ynab';
import * as moment from 'moment';
require('dotenv').config();

import GenericController from './generic';

interface MonzoTransaction {
  type: string;
  data: {
    account_id: string;
    amount: number;
    created: string;
    currency: string;
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
    console.log('Monzo transaction:', transaction);
    super({
      account_id: process.env.YNAB_MONZO_ACCOUNT_ID,
      amount: transaction.data.amount,
      date: moment(transaction.data.created).toISOString(),
      memo: process.env.APPLY_MEMO || '',
      payee_name: transaction.data.merchant.name,
      // cleared: ynab.TransactionDetail.ClearedEnum['cleared'],
      // flag_color: ynab.TransactionDetail.FlagColorEnum['blue'],
    });
    // category_name: string,
  }
}
