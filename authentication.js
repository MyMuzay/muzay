const test = async (z, bundle) => {
  return {status: 'ok'};
};

module.exports = {
  type: 'custom',
  fields: [
    {
      key: 'user_address',
      label: 'User Address',
      required: true,
      type: 'string',
      placeholder: '0x...',
      helpText:
        'What is your Rinkeby Wallet Address?',
    },
  ],
  test,
};
