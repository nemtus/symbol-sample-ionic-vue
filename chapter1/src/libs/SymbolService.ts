import { Account, Address, Deadline, NetworkCurrencies, NetworkType, PlainMessage, RepositoryFactoryHttp, TransactionService, TransferTransaction } from 'symbol-sdk';

const nodeUrl = 'https://sym-test.opening-line.jp:3001';
const networkType = NetworkType.TEST_NET;
const networkGenerationHash = '3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155'
const epochAdjustment = 1616694977;

const repoFactory = new RepositoryFactoryHttp(nodeUrl, {
  websocketUrl: `${nodeUrl.replace('http', 'ws')}/ws`,
  websocketInjected: WebSocket,
});

const senderPrivateKey = process.env.VUE_APP_SENDER_PRIVATE_KEY;
const senderAccount = Account.createFromPrivateKey(senderPrivateKey, networkType);

// faucet address
const targetAddress = 'TCLQ3QKUFV6I35FVDXVMB7X4CWI3FLAOVQGNKCQ';

export async function sendTransaction() {
  console.log('send Transaction');
  const transferTransaction = TransferTransaction.create(
    Deadline.create(epochAdjustment),
    Address.createFromRawAddress(targetAddress),
    [NetworkCurrencies.PUBLIC.currency.createRelative(1)],
    PlainMessage.create('hello ionic vue'),
    networkType,
  ).setMaxFee(110);

  const signedTransaction = senderAccount.sign(transferTransaction, networkGenerationHash);
  console.log(signedTransaction.hash);
  const transactionRepo = repoFactory.createTransactionRepository();
  const receiptRepo = repoFactory.createReceiptRepository();
  const transactionService = new TransactionService(transactionRepo, receiptRepo);
  const listener = repoFactory.createListener();
  await listener.open();
  try {
    const transaction = await transactionService.announce(signedTransaction, listener).toPromise();
    return transaction;
  } catch(err) {
    console.error(err);
    throw(err);
  } finally {
    listener.close();
  }
}
