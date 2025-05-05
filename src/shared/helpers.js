function generateStrongPassword(length = 20) {
      const lowercase = 'abcdefghijklmnopqrstuvwxyz';
      const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numbers = '0123456789';

      const allChars = lowercase + uppercase + numbers + symbols;

      let password = [
            lowercase[Math.floor(Math.random() * lowercase.length)],
            uppercase[Math.floor(Math.random() * uppercase.length)],
            numbers[Math.floor(Math.random() * numbers.length)],
      ];

      for (let i = password.length; i < length; i++) {
            password.push(allChars[Math.floor(Math.random() * allChars.length)]);
      }

      password = password
            .sort(() => Math.random() - 0.5)
            .join('');

      return password;
}
module.exports = {generateStrongPassword}