import type { UserAuth } from '@/modules/auth/domain/entities/user-auth.entity'
import { authService } from '@/modules/auth/domain/services/auth.service'

export class RefreshTokenUseCase {
    async execute(refreshToken: string): Promise<UserAuth> {
        return authService.refresh(refreshToken)
    }
}
