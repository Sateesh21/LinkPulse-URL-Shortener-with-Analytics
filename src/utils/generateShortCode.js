const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const toBase62 = (number) => {
  let shortCode = "";

  while (number > 0) {
    const rem = number % 62;
    shortCode = chars[rem] + shortCode;
    number = Math.floor(number / 62);
  }

  return shortCode;
};

const generateShortCode = () => {
  const randomNumber = Math.floor(Math.random() * 999999999) + 100000;
  return toBase62(randomNumber);
};

generateShortCode();

module.exports = generateShortCode;
