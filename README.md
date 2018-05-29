[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/adambowles/fintech-to-ynab-js)

# fintech-to-ynab-js

JS (TypeScript) port of [fintech-to-ynab](https://github.com/fintech-to-ynab/fintech-to-ynab)

Installing and gathering of requisite information is very similar to fintech-to-ynab, see their [Getting Started](https://github.com/fintech-to-ynab/fintech-to-ynab/wiki/Getting-Started) wiki

## Environment variables explained

`YNAB_ACCESS_TOKEN`
Find this via: [YNAB's developer docs](https://api.youneedabudget.com/). It will be in the format of a 64 character hexadecimal string

`YNAB_BUDGET_ID`
See [YNAB's developer docs](https://api.youneedabudget.com/).

`YNAB_MONZO_ACCOUNT_ID`
See [YNAB's developer docs](https://api.youneedabudget.com/).

`YNAB_STARLING_ACCOUNT_ID`
See [YNAB's developer docs](https://api.youneedabudget.com/).

`URL_SECRET`
If deploying to Heroku this will be auto generated for you, find it in the 'Config vars' section of your Heroku settings (https://dashboard.heroku.com/apps/your-app-name/settings). It will be in the format of a 64 character hexadecimal string

`APPLY_MEMO`
Whatever string you want to write into the memo field of every transaction, e.g. "Auto imported". So you can quickly recognise automatically import transactions

`AUTO_CLEAR`
Boolean-ish. Leave empty or write `false` to disable auto clearing

`FOREIGN_CURRENCY_APPLY_FLAG`
Apply a flag to all foreign currency transactions. One of: Red, Orange, Yellow, Green, Blue, or Purple. Leave blank for no flag

`DOMESTIC_CURRENCY_APPLY_FLAG`
Apply a flag to all domestic currency transactions. One of: Red, Orange, Yellow, Green, Blue, or Purple. Leave blank for no flag
