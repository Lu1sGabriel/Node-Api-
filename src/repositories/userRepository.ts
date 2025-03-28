import prisma from "../orm/prisma";

export async function create(data: any) {
    return await prisma.users.create({
        data,
    });
}

export async function findById(id: string) {
    return await prisma.users.findUnique({
        where: {
            id,
        },
    });
}

export async function findByEmail(email: string) {
    return await prisma.users.findUnique({
        where: {
            email,
        },
    });
}