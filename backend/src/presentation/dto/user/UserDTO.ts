export class UserCreateDTO {
    name: string;
    email: string;
    cpf: string;
    password: string;
    avatar?: string;

    public constructor(name: string, email: string, cpf: string, password: string, avatar?: string) {
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.password = password;
        this.avatar = avatar || "default-avatar.png";
    }

}

export class UserUpdateDTO {
    name?: string;
    email?: string;
    password?: string;
    avatar?: string;

    public constructor(name?: string, email?: string, password?: string, avatar?: string) {
        if (name) this.name = name;
        if (email) this.email = email;
        if (password) this.password = password;
        if (avatar) this.avatar = avatar;
    }

}

export class UserLoginDTO {
    email: string;
    password: string;

    public constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

}