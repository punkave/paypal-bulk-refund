const paypal = require('paypal-rest-sdk');
const argv = require('boring')();

let transactions;

try {
  transactions = require('csv-parse/lib/sync')(require('fs').readFileSync(argv._[0], 'utf8'));
} catch (e) {
  console.error(e);
  console.error('First argument must be a file containing a PayPal transaction ID on each line.');
  process.exit(1);
}

const Promise = require('bluebird');

if (!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET)) {
  console.error('You must set the PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET environment variables.');
  console.error('You may also set PAYPAL_MODE to sandbox, otherwise it is set to live.');
  process.exit(1);
}

(async function() {
  paypal.configure({
    mode: process.env.PAYPAL_MODE || 'live',
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET
  });

  const refund = require('util').promisify(function(id, cb) {
    // wrap it to avoid being outsmarted by a .length check on the method
    return paypal.sale.refund(id, {}, {}, cb);
  });

  let total = transactions.length;
  let done = 0;
  let errors = [];

  // Let's do 3 at a time. Paypal probably would throttle us if
  // we pushed it too far, right?

  await Promise.map(transactions, refundOne, { concurrency: 3 });

  async function refundOne(transaction) {
    transaction = transaction[0];
    try {
      await refund(transaction);
    } catch (e) {
      errors.push(transaction);
      console.error('ERROR for ' + transaction, e);
    }
    done++;
    console.log(done + ' of ' + total + ' completed, with ' + errors.length + 'errors');
  }

  if (errors.length) {
    console.error('Ended with errors for these transaction IDs:');
    console.error(errors);
    process.exit(1);
  } else {
    console.log('Done');
  }

})();
