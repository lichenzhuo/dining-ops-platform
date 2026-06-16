import type { LoginPayload, LoginResult } from '@/types/auth'
import { mockGetUserByToken, mockLogin } from '@/mocks/auth'

export async function login(payload: LoginPayload): Promise<LoginResult> {
  return mockLogin(payload)
}

export async function fetchSessionByToken(token: string): Promise<LoginResult | null> {
  return mockGetUserByToken(token)
}
