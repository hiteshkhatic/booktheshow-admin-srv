export interface createAdminDTO {
    username: string;
    password: string;
}

export interface AdminResponseDTO {
    id: string;
    username: string;
}

export const toAdminResponseDTO = (
    admin: { id: string; username: string; [key: string]: any} | null | undefined
) : AdminResponseDTO => {
    if (!admin) {
        throw new Error('USER_NOT_FOUND');
    }
    return {
        id: admin.id,
        username: admin.username,
    }
}