A simple bulk refund tool for the PayPal REST API. Use at your own risk.

```
npm install -g paypal-bulk-refund

PAYPAL_CLIENT_ID=xxx PAYPAL_CLIENT_SECRET=yyy PAYPAL_MODE=live paypal-bulk-refund my-transaction-ids.txt
```

`PAYPAL_MODE` defaults to `live`. You can also set it to `sandbox`.

See the PayPal documentation for more information about obtaining a client ID and secret for use with the REST API.

`my-transaction-ids.txt` can be any file containing one PayPal transaction ID per line, and nothing else.

If errors occur for some transactions the tool will continue, and print a summary at the end.

To obtain transaction IDs in bulk, use the export feature of the PayPal website.

Hope you find it helpful!

## Changelog

1.0.1: fixed repo link. No code changes.

1.0.0: initial release.
