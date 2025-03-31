export default class Validators {

    public static validatePersonalName(name: string): boolean {
        const NAME_REGEX = /^[a-zA-Z\u00C0-\u00FF\s]+$/;
        return NAME_REGEX.test(name);
    }

    public static validateEmailAddress(email: string): boolean {
        const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return EMAIL_REGEX.test(email);
    }

    public static validateCpf(cpf: string): boolean {
        if (typeof cpf !== 'string') return false;

        cpf = cpf.replace(/[^\d]/g, '');

        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        const cpfArray = cpf.split('').map(Number);

        const calculateDigit = (factor: number): number => {
            const sum = cpfArray
                .slice(0, factor - 1)
                .reduce((total, num, index) => total + num * (factor - index), 0);

            const remainder = (sum * 10) % 11;
            return remainder === 10 ? 0 : remainder;
        };

        const digit1 = calculateDigit(10);
        const digit2 = calculateDigit(11);

        return digit1 === cpfArray[9] && digit2 === cpfArray[10];
    }

    public static validatePassword(password: string): boolean {
        if (password.length < 8) return false;

        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    }


}