import type { UserAuth } from '@/modules/auth/domain/entities/user-auth.entity'
import { authService } from '@/modules/auth/domain/services/auth.service'
import type { LoginRequestDto } from '@/modules/auth/application/dto/auth.dto'

export class LoginUseCase {
    async execute(loginRequestDto: LoginRequestDto): Promise<UserAuth> {
        return authService.login(loginRequestDto)
    }
}
