declare namespace Starling {
  interface CurrencyAndAmount {
    currency: string;
    minorUnits: number;
  }

  type WebhookType = 'INTEREST_CHARGE' |
    'SCHEDULED_PAYMENT_CANCELLED' |
    'SCHEDULED_PAYMENT_INSUFFICIENT_FUNDS' |
    'TRANSACTION_CARD' |
    'TRANSACTION_CASH_WITHDRAWAL' |
    'TRANSACTION_MOBILE_WALLET' |
    'TRANSACTION_DIRECT_CREDIT' |
    'TRANSACTION_DIRECT_DEBIT' |
    'TRANSACTION_DIRECT_DEBIT_INSUFFICIENT_FUNDS' |
    'TRANSACTION_DIRECT_DEBIT_DISPUTE' |
    'TRANSACTION_FASTER_PAYMENT_IN' |
    'TRANSACTION_FASTER_PAYMENT_OUT' |
    'TRANSACTION_FASTER_PAYMENT_REVERSAL' |
    'TRANSACTION_INTEREST_PAYMENT' |
    'TRANSACTION_INTERNAL_TRANSFER' |
    'TRANSACTION_NOSTRO_DEPOSIT' |
    'TRANSACTION_INTEREST_WAIVED_DEPOSIT' |
    'TRANSACTION_STRIPE_FUNDING' |
    'TRANSACTION_DECLINED_INSUFFICIENT_FUNDS' |
    'TRANSACTION_AUTH_DECLINED' |
    'TRANSACTION_AUTH_PARTIAL_REVERSAL' |
    'TRANSACTION_AUTH_FULL_REVERSAL';

  type Direction = 'PAYMENT' | 'REFUND';

  type Status = 'PENDING' | 'SETTLED';

  type TransactionMethod =
    'CONTACTLESS' |
    'MAGNETIC_STRIP' |
    'MANUAL_KEY_ENTRY' |
    'CHIP_AND_PIN' |
    'ONLINE' |
    'ATM' |
    'APPLE_PAY' |
    'ANDROID_PAY' |
    'OTHER_WALLET' |
    'NOT_APPLICABLE' |
    'UNKNOWN';

  interface MerchantPosData {
    posTimestamp: string;
    cardLast4: string;
    authorisationCode: string;
    country: string;
    merchantIdentifier: string;
  }

  export interface Webhook {
    webhookNotificationUid: string;
    customerUid: string;
    webhookType: WebhookType;
    eventUid: string;
    transactionAmount: CurrencyAndAmount;
    sourceAmount: CurrencyAndAmount;
    direction: Direction;
    description: string;
    merchantUid: string;
    merchantLocationUid: string;
    status: Status;
    transactionMethod: TransactionMethod;
    transactionTimestamp: string;
    merchantPosData: MerchantPosData;
    accountHolderUid: string;
  }
}
