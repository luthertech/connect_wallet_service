module.exports = function (config) {
  this.api_key = config.api_key;
  this.api_secret = config.api_secret;
  this.default_issuer = config.default_issuer;
  this.default_currency_hex = config.default_currency_hex;
  this.default_limit = config.default_limit;
  this.default_memo = config.default_memo;

  this.generate_default_config = function () {
    return {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-API-Key": this.api_key,
        "X-API-Secret": this.api_secret,
      },
      url: "",
    };
  };

  this.login_payload = function () {
    let payload = this.generate_default_config();
    payload.url = "https://xumm.app/api/v1/platform/payload";
    payload.data = {
      options: {
        submit: true,
        multisign: false,
        expire: 15,
      },
      txjson: {
        TransactionType: "SignIn",
      },
    };
    return payload;
  };

  this.offer_payload = function (
    account,
    mode,
    token,
    taker_get,
    currency,
    issuer,
    value
  ) {
    let taker_pay = {
      currency: currency,
      issuer: issuer,
      value: value,
    };

    let payload = this.generate_default_config();

    payload.url = "https://xumm.app/api/v1/platform/payload";

    payload.data = {
      user_token: token,
      options: {
        submit: true,
        multisign: false,
        expire: 15,
      },
      txjson: {
        TransactionType: "OfferCreate",
        Account: account,
        Fee: 100,
        TakerGets: mode == "buy" ? taker_get.toString() : taker_pay,
        TakerPays: mode == "buy" ? taker_pay : taker_get.toString(),
      },
    };

    return payload;
  };

  this.delete_offer_payload = function (account, token, offer_sequence) {
    let payload = this.generate_default_config();
    payload.url = "https://xumm.app/api/v1/platform/payload";
    payload.data = {
      user_token: token,
      options: {
        submit: true,
        multisign: false,
        expire: 15,
      },
      txjson: {
        TransactionType: "OfferCancel",
        Account: account,
        Fee: 100,
        OfferSequence: offer_sequence,
      },
    };
    return payload;
  };

  this.trustline_payload = function (issuer, token, currency_hex, limit) {
    //Reference: https://xrpl.org/trustset.html

    if (!issuer || !currency_hex) {
      issuer = this.default_issuer;
      currency_hex = this.default_currency_hex;
      limit = this.default_limit;
    }

    if (!limit) {
      limit = 100000000;
    }

    let payload = this.generate_default_config();
    payload.url = "https://xumm.app/api/v1/platform/payload";
    payload.data = {
      user_token: token,
      options: {
        submit: true,
        multisign: false,
        expire: 15,
      },
      txjson: {
        TransactionType: "TrustSet",
        Flags: 131072,
        LastLedgerSequence: 8007750,
        LimitAmount: {
          currency: currency_hex,
          issuer: issuer,
          value: limit,
        },
        memo: "Note" + this.default_memo,
      },
    };
    return payload;
  };

  this.get_payload = function (uuid) {
    let payload = this.generate_default_config();
    payload.url = "https://xumm.app/api/v1/platform/payload/" + uuid;
    payload.method = "GET";
    return payload;
  };

  return this;
};
