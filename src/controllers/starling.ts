import * as ynab from 'ynab';

require('dotenv').config();

import AbstractController from './abstract';

export default class StarlingController extends AbstractController {
  public constructor(webhook: Starling.Webhook) {
    super();

    console.log(
      'Received Starling webhook:',
      JSON.stringify(webhook, undefined, 2),
    );

    this.account_id = process.env.YNAB_STARLING_ACCOUNT_ID;
    this.date = webhook.transactionTimestamp;
    this.payee_name = this.determinePayeeName(webhook);

    if (webhook.direction === 'PAYMENT') {
      this.amount = Math.abs(webhook.transactionAmount.minorUnits) / 100;
    } else {
      this.amount = (Math.abs(webhook.transactionAmount.minorUnits) * -1) / 100;
    }

    if (webhook.description) {
      this.memo = webhook.description;
    }

    if (webhook.sourceAmount.currency !== 'GBP') {
      if (process.env.FOREIGN_CURRENCY_APPLY_FLAG) {
        this.flag_color =
          ynab.TransactionDetail.FlagColorEnum[
            process.env
              .FOREIGN_CURRENCY_APPLY_FLAG as keyof typeof ynab.TransactionDetail.FlagColorEnum
          ];
      }

      const foreignAmount = new Intl.NumberFormat(
        'en-GB',
        {
          style: 'currency',
          currency: webhook.sourceAmount.currency,
        }
      ).format(webhook.sourceAmount.minorUnits);

      this.memo = `(${foreignAmount}) ${this.memo}`;
    }
  }

  private readonly determinePayeeName = (
    webhook: Starling.webhook,
  ): string => {
    try {
      return webhook.description.substr(0, 50);
    } catch (error) {
      return '';
    }
  };
}
