import { AuthMapper } from '@/modules/auth/infrastructure/mappers/auth.mapper';

import type { AuthRepository } from '@/modules/auth/domain/repositories/auth.repository'
import type { UserAuth } from '@/modules/auth/domain/entities/user-auth.entity'

import { API_URL } from '@/app/config/env';

export class AuthRepositoryImpl implements AuthRepository {
    async login(email: string, password: string): Promise<UserAuth> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })

        if (!response.ok) {
            try {
                const errorBody = await response.json() as { detail?: string }
                if (typeof errorBody?.detail === 'string' && errorBody.detail.trim().length > 0) {
                    throw new Error(errorBody.detail)
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    throw error
                }
            }
        }
        const data = await response.json()
        return AuthMapper.fromApi(data)
    }

    async logout(): Promise<void> {
        console.log('Logout not implemented')
    }
}

export const authRepository = new AuthRepositoryImpl()
