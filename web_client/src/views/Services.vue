<template>
  <div class="services">
    <h2>Our Services</h2>
    <div class="services-panel">
      <button
        class="service-card"
        v-for="service in services"
        :key="service.name"
        @click="initializeService(service.name)"
      >
        <div class="icon">
          <BankPlus v-show="service.icon === 'BankPlus'" />
          <BankMinus v-show="service.icon === 'BankMinus'" />
          <BankTransfer v-show="service.icon === 'BankTransfer'" />
        </div>
        <div class="title">
          <strong>{{ service.name }}</strong>
          <Launch />
        </div>
      </button>
    </div>

    <Modal
      :modalOpen="isDialogOpen"
      :modalTitle="activeService.dialogTitle || ''"
      :hasHeader="true"
      v-on:request-close="closeDialog"
    >
      <template v-slot:modal-body>
        <div>
          <div v-show="activeService.name === 'Deposit'">
            <div class="money-panel input-panel">
              <Naira />
              <input
                type="text"
                class="mb-inputtext-lg"
                placeholder="Amount"
                v-model="servicesDataStore.deposit.depositAmount"
              />
              <span>.00</span>
            </div>
          </div>

          <div v-show="activeService.name === 'Withdraw'">
            <div class="money-panel input-panel">
              <Naira />
              <input
                type="text"
                class="mb-inputtext-lg"
                placeholder="Amount"
                v-model="servicesDataStore.withdraw.withdrawAmount"
              />
              <span>.00</span>
            </div>
          </div>

          <div v-show="activeService.name === 'Transfer'">
            <div class="money-panel input-panel">
              <Naira />
              <input
                type="text"
                class="mb-inputtext-lg"
                placeholder="Amount"
                v-model="servicesDataStore.transfer.transferAmount"
              />
              <span>.00</span>
            </div>
            <div class="input-panel">
              <input
                type="text"
                class="mb-inputtext-lg"
                placeholder="Account"
                v-model="servicesDataStore.transfer.transferAccount"
              />
            </div>
          </div>
        </div>
      </template>

      <template v-slot:modal-action-panel>
        <div class="pane-container">
          <div>
            <button class="mb-button-rounded" @click="runService">
              <Loading v-show="isServiceRunning" />
              <strong v-show="!isServiceRunning">Done</strong>
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';
import Launch from '@/assets/icons/Launch.vue';
import Naira from '@/assets/icons/Naira.vue';
import Loading from '@/assets/icons/Loading.vue';
import BankTransfer from '@/assets/icons/BankTransfer.vue';
import BankMinus from '@/assets/icons/BankMinus.vue';
import BankPlus from '@/assets/icons/BankPlus.vue';
import TransactionAPIReq from '@/modules/api_requests/transaction';
import Modal from '@/views/layout/Modal.vue';

interface ServiceInfo {
  name: string;
  icon: string;
  dialogTitle: string;
}

@Options({
  components: {
    Launch,
    BankPlus,
    BankMinus,
    BankTransfer,
    Modal,
    Loading,
    Naira,
  },
})
export default class Services extends Vue {
  store = useStore();
  transactionAPIReq = new TransactionAPIReq(
    this.store.state.API_URL,
    this.store.state.user.authToken,
  );
  dialogType = '';
  activeService: ServiceInfo = {
    name: '',
    icon: '',
    dialogTitle: '',
  };
  isServiceRunning = false;
  isDialogOpen = false;
  servicesDataStore = {
    deposit: {
      depositAmount: '0',
    },
    withdraw: {
      withdrawAmount: '0',
    },
    transfer: {
      transferAmount: '0',
      transferAccount: '',
    },
  };
  services: Array<ServiceInfo> = [
    {
      name: 'Deposit',
      icon: 'BankPlus',
      dialogTitle: 'Deposit Funds',
    },
    {
      name: 'Withdraw',
      icon: 'BankMinus',
      dialogTitle: 'Withdraw Funds',
    },
    {
      name: 'Transfer',
      icon: 'BankTransfer',
      dialogTitle: 'Transfer Funds',
    },
  ];

  depositService(): void {
    this.isServiceRunning = true;
    let amount = 0;
    const numberPattern = /^\d+$/g;
    if (numberPattern.test(this.servicesDataStore.deposit.depositAmount)) {
      amount = Number.parseInt(this.servicesDataStore.deposit.depositAmount);
      amount *= 100;
    }
    this.transactionAPIReq
      .deposit(amount)
      .then((res) => {
        if (res.__typename === 'ActionResult') {
          alert(res.message);
        }
        this.isServiceRunning = false;
        this.closeDialog();
      })
      .catch(() => {
        this.isServiceRunning = false;
        this.closeDialog();
      });
  }

  withdrawService(): void {
    this.isServiceRunning = true;
    let amount = 0;
    const numberPattern = /^\d+$/g;
    if (numberPattern.test(this.servicesDataStore.withdraw.withdrawAmount)) {
      amount = Number.parseInt(this.servicesDataStore.withdraw.withdrawAmount);
      amount *= 100;
    }
    this.transactionAPIReq
      .withdraw(amount)
      .then((res) => {
        if (res.__typename === 'ActionResult') {
          alert(res.message);
        }
        this.isServiceRunning = false;
        this.closeDialog();
      })
      .catch(() => {
        this.isServiceRunning = false;
        this.closeDialog();
      });
  }

  transferService(): void {
    this.isServiceRunning = true;
    let amount = 0;
    const numberPattern = /^\d+$/g;
    if (numberPattern.test(this.servicesDataStore.transfer.transferAmount)) {
      amount = Number.parseInt(this.servicesDataStore.transfer.transferAmount);
      amount *= 100;
    }
    this.transactionAPIReq
      .transfer(amount, this.servicesDataStore.transfer.transferAccount)
      .then((res) => {
        if (res.__typename === 'ActionResult') {
          alert(res.message);
        }
        this.isServiceRunning = false;
        this.closeDialog();
      })
      .catch(() => {
        this.isServiceRunning = false;
        this.closeDialog();
      });
  }

  initializeService(name: string): void {
    if (this.isServiceRunning) {
      // TODO: send a busy notification.
      return;
    }
    for (const service of this.services) {
      if (service.name === name) {
        this.activeService = service;
        this.dialogType = name;
        this.isDialogOpen = true;
        break;
      }
    }
  }

  runService(): void {
    if (this.isServiceRunning) {
      // TODO: send a busy notification.
      return;
    }
    if (this.activeService.name === 'Deposit') {
      this.depositService();
    }
    if (this.activeService.name === 'Withdraw') {
      this.withdrawService();
    }
    if (this.activeService.name === 'Transfer') {
      this.transferService();
    }
  }

  closeDialog(): void {
    this.dialogType = '';
    this.isDialogOpen = false;
  }
}
</script>

<style lang="scss">
@use '@/assets/styles/services';
</style>
