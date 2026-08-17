import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        login: resolve(import.meta.dirname, 'index.html'),
        register: resolve(import.meta.dirname, 'register/index.html'),
        dashboard: resolve(import.meta.dirname, 'dashboard/index.html'),
        transfers: resolve(import.meta.dirname, 'transfers/index.html'),
        bankTransfer: resolve(import.meta.dirname, 'transfers/bank-transfer/index.html'),
        payFriend: resolve(import.meta.dirname, 'transfers/pay-a-friend/index.html'),
        requestPayment: resolve(import.meta.dirname, 'transfers/request-payment/index.html'),
        transactions: resolve(import.meta.dirname, 'transfers/transactions/index.html'),
        card: resolve(import.meta.dirname, 'card/index.html'),
      },
    },
  },
})
