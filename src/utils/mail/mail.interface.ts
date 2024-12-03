export interface IMailService {
    sendOtp(to: string, otp: string): Promise<void>;
}
