import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const appName = '餐饮连锁运营平台'

  return {
    appName,
  }
})
