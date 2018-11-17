Crypto = (require '../cryptojs').Crypto
key = '12345678'
us = 'Hello, 世界!'

mode = new Crypto.mode.ECB Crypto.pad.pkcs7

