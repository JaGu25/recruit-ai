import { AuthMapper } from '@/modules/auth/infrastructure/mappers/auth.mapper';

import type { AuthRepository } from '@/modules/auth/domain/repositories/auth.repository'
import type { UserAuth } from '@/modules/auth/domain/entities/user-auth.entity'

import { api } from '@/app/config/api';

export class AuthRepositoryImpl implements AuthRepository {
    async login(email: string, password: string): Promise<UserAuth> {
        const { data } = await api.post('/auth/login', { email, password })
        return AuthMapper.fromApi(data)
    }

    async logout(): Promise<void> {
        console.log('Logout not implemented')
    }

    async refresh(refreshToken: string): Promise<UserAuth> {
        const { data } = await api.post('/auth/refresh', { refresh_token: refreshToken })
        return AuthMapper.fromApi(data)
    }
}

export const authRepository = new AuthRepositoryImpl()
