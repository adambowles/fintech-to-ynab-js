declare namespace Monzo {
  export interface Webhook {
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
}
