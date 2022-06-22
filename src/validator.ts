export interface IValidate {
    businessId(id: string): boolean;
}

export default class Validate {

    public businessId(y: string): boolean {
        // append 0 if only 6 digits
        const yId = y.match(/^[0-9]{6}\-[0-9]{1}/) ? `0${y}` : y;

        // check format
        if (!yId.match(/^[0-9]{7}\-[0-9]{1}/)) {
            return false;
        }

        const [id, checksumString] = yId.split('-');
        const checksum = parseInt(checksumString, 10);

        let count = 0;
        const multipliers = [7, 9, 10, 5, 8, 4, 2];

        multipliers.forEach((mp, i) => {
            count = count + (mp * parseInt(id.charAt(i), 10));
        });

        const modulus = count % 11;

        // invalid modulus
        if (modulus === 1) {
            return false;
        }

        // Remainder 0 leads into checksum 0.
        if (modulus === 0) {
            return modulus === checksum;
        }

        // If remainder is not 0, the checksum should be remainder deducted from 11.
        return checksum === 11 - modulus;
    }

}