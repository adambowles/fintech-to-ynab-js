import * as ynab from 'ynab';

require('dotenv').config();

import AbstractController from './abstract';

export default class MonzoController extends AbstractController {
  public constructor(webhook: Monzo.Webhook) {
    super();

    console.log(
      'Received Monzo webhook:',
      JSON.stringify(webhook, undefined, 2),
    );

    this.account_id = process.env.YNAB_MONZO_ACCOUNT_ID;
    this.amount = webhook.data.amount * 10;
    this.date = webhook.data.created;
    this.payee_name = this.determinePayeeName(webhook);

    if (webhook.data.counterparty) {
      this.memo = webhook.data.notes;
    }

    if (webhook.data.local_currency !== 'GBP') {
      const local_amount = new Intl.NumberFormat(
        'en-GB',
        {
          style: 'currency',
          currency: webhook.data.local_currency,
        }
      ).format(webhook.data.local_amount);

      this.memo = `(${local_amount} ${webhook.data.local_currency}) ${
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
    webhook: Monzo.Webhook,
  ): string => {
    try {
      return webhook.data.merchant.name.substr(0, 50);
    } catch (error) {}

    try {
      return webhook.data.counterparty.name.substr(0, 50);
    } catch (error) {}

    try {
      return webhook.data.description.substr(0, 50);
    } catch (error) {
      return '';
    }
  };
}
