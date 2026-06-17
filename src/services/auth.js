import { mockGetUserByToken, mockLogin } from '@/mocks/auth'

export async function login(payload) {
  return mockLogin(payload)
}

export async function fetchSessionByToken(token) {
  return mockGetUserByToken(token)
}
