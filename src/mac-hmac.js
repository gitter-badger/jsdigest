/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  HMAC - keyed-Hash Message Authentication Code
**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~**/

(function () {
  
  this.Digest.fn.hmac = function hmac(hash, data, hkey, utf8) {
    var i, akey, ipad, opad;
    
    // verify arguments
    if ('function' !== typeof hash) {
      throw new Error('Hash must be a function');
    }
    if ('string' !== typeof data) {
      throw new Error('Data must be a string');
    }
    if ('string' !== typeof hkey) {
      throw new Error('Key must be a string');
    }
    
    // verify hash configuration
    if (!(hash.block > 0 && 'function' === typeof hash.curry)) {
      throw new Error('Hash function is not properly configured');
    }
    
    // single-byte encode data, either UTF-8 or truncated
    if (false !== utf8) {
      data = Digest.Encoder(data).utf8();
      hkey = Digest.Encoder(hkey).utf8();
    }
    
    // prepare akey
    if (hkey.length > hash.block) {
      akey = hash.curry(hkey).single();
    } else {
      akey = Digest.Encoder(hkey).single();
    }
    
    // fill padding
    for (i = 0, ipad = [], opad = []; i < hash.block; i += 1) {
      ipad[i] = (akey[i] || 0x00) ^ 0x36;
      opad[i] = (akey[i] || 0x00) ^ 0x5c;
    }
    
    // finalize padding
    ipad = Digest.Encoder(ipad).trunc();
    opad = Digest.Encoder(opad).trunc();
    
    // finish
    return hash.curry(opad + hash.curry(ipad + data).trunc());
  };
  
}());
