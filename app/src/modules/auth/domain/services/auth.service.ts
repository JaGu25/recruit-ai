import type { LoginRequestDto } from '@/modules/auth/application/dto/auth.dto'
import type { UserAuth } from '@/modules/auth/domain/entities/user-auth.entity'
import type { AuthRepository } from '@/modules/auth/domain/repositories/auth.repository'
import { authRepository } from '@/modules/auth/infrastructure/repositories/auth.repository.impl'

export class AuthService {
    constructor(private repository: AuthRepository) { }

    async login({ email, password }: LoginRequestDto): Promise<UserAuth> {
        return this.repository.login(email, password)
    }

    async logout(): Promise<void> {
        return this.repository.logout()
    }
}

export const authService = new AuthService(authRepository)
