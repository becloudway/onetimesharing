export default class PasswordRules {
    private static MIN_PASSWORD_LENGTH = 8;
    private static MIN_SPECIAL_CHARACTERS = 0;
    private static MIN_NUMBERS = 0;
    private static MUST_CONTAIN_ONE_CAPITAL_LETTER = false;

    public static checkPasswordRules(password: string): { valid: boolean, message: string } {
        if (password.length < this.MIN_PASSWORD_LENGTH) {
            return {
                valid: false,
                message: `Password must be at least ${this.MIN_PASSWORD_LENGTH} characters long.`
            };
        }
        
        const specialCharCount = (password.match(/[^a-zA-Z0-9]/g) || []).length;
        if (specialCharCount < this.MIN_SPECIAL_CHARACTERS) {
            return {
                valid: false,
                message: `Password must contain at least ${this.MIN_SPECIAL_CHARACTERS} special characters.`
            };
        }

        const numberCount = (password.match(/[0-9]/g) || []).length;
        if (numberCount < this.MIN_NUMBERS) {
            return {
                valid: false,
                message: `Password must contain at least ${this.MIN_NUMBERS} numeric characters.`
            };
        }

        if (this.MUST_CONTAIN_ONE_CAPITAL_LETTER && !/[A-Z]/.test(password)) {
            return {
                valid: false,
                message: "Password must contain at least one capital letter."
            };
        }

        return {
            valid: true,
            message: ""
        };
    }
}
