import type { UserAuth } from "@/modules/auth/domain/entities/user-auth.entity"

export interface AuthRepository {
    login(email: string, password: string): Promise<UserAuth>
    logout(): Promise<void>
}