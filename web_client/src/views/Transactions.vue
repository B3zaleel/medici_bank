<template>
  <div class="transactions">
    <h2>Transactions History</h2>
    <br />
    <div v-for="(transactionBatch, i) in transactionBatches" :key="i">
      <div
        v-for="transaction in transactionBatch"
        :key="transaction.id"
        class="transaction-card"
      >
        <div>
          <div class="info-line">
            <strong>Info:</strong>
            <em>{{
              transaction.info.length > 0 ? transaction.info : 'N/A'
            }}</em>
          </div>

          <div class="info-line">
            <strong>Date:</strong>
            <em>{{ formatDate(transaction.createdOn) }}</em>
          </div>

          <div class="info-line">
            <strong>Type:</strong>
            <em>{{ transaction.type }}</em>
          </div>

          <div class="info-line">
            <strong>Amount:</strong>
            <em>&#x20A6; {{ transaction.amount / 100 }}</em>
          </div>

          <div class="info-line">
            <strong>Balance:</strong>
            <em>&#x20A6; {{ transaction.balance / 100 }}</em>
          </div>

          <div class="info-line">
            <strong>Id:</strong>
            <em>{{ transaction.id }}</em>
          </div>
        </div>
      </div>
    </div>

    <div
      v-show="isTransactionsFinished && transactionBatches.length === 0"
      class="no-transactions-panel"
    >
      <strong>No Transactions Made</strong>
    </div>

    <div :class="{ pager_panel: true, visible: !isTransactionsFinished }">
      <button class="icon-btn" @click="runTransactionsService">
        <Refresh v-show="loadingFailed && !isTransactionsLoading" />
        <Loading v-show="isTransactionsLoading" />
        <DotsHorizontal v-show="!loadingFailed && !isTransactionsLoading" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';
import Refresh from '@/assets/icons/Refresh.vue';
import Loading from '@/assets/icons/Loading.vue';
import DotsHorizontal from '@/assets/icons/DotsHorizontal.vue';
import { Transaction } from '@/modules/types/transaction';
import TransactionAPIReq from '@/modules/api_requests/transaction';

@Options({
  components: {
    Loading,
    Refresh,
    DotsHorizontal,
  },
})
export default class Transactions extends Vue {
  store = useStore();
  transactionAPIReq = new TransactionAPIReq(
    this.store.state.API_URL,
    this.store.state.user.authToken,
  );
  isTransactionsFinished = false;
  isTransactionsLoading = false;
  loadingFailed = false;
  batchCount = 5;
  lastTransactionId = '';
  transactionBatches: Array<Transaction[]> = [];

  formatDate(date: Date): string {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const month = months[date.getUTCMonth()];
    const monthDay = date.getUTCDate().toString();
    const [a, b] = [
      monthDay[monthDay.length - 1],
      monthDay[monthDay.length - 2],
    ];
    let ordinal = 'th';

    if (a === '1' && b !== '1') {
      ordinal = 'st';
    } else if (a === '2' && b !== '1') {
      ordinal = 'nd';
    } else if (a === '3' && b !== '1') {
      ordinal = 'rd';
    }
    const time = `${date.toLocaleTimeString()}`;
    return `${month} ${monthDay}${ordinal} ${date.getFullYear()} ${time}`;
  }

  fetchTransactions(): void {
    this.isTransactionsLoading = true;
    this.transactionAPIReq
      .getTransactions(this.batchCount, this.lastTransactionId)
      .then((transactions) => {
        const newTransactionBatch = [];
        for (const transaction of transactions) {
          if (transaction.__typename === 'Transaction') {
            newTransactionBatch.push(transaction);
            this.lastTransactionId = transaction.id;
          }
        }
        this.transactionBatches.push(newTransactionBatch);
        if (newTransactionBatch.length < this.batchCount) {
          this.isTransactionsFinished = true;
        }
        this.isTransactionsLoading = false;
        this.loadingFailed = false;
      })
      .catch((err) => {
        console.log(err);
        this.isTransactionsLoading = false;
        this.loadingFailed = true;
      });
  }

  runTransactionsService(): void {
    if (!this.isTransactionsLoading) {
      this.fetchTransactions();
    }
  }

  mounted() {
    this.fetchTransactions();
  }
}
</script>

<style lang="scss">
@use '@/assets/styles/transactions';
</style>
