import React, { useState } from 'react';
import { useEncryption } from '../../core/Encryption.js';
import { useHash } from '../../core/Hash.js';
import { useToken } from '../../core/Token.js';
import { Shield, Key, Lock, Unlock, Copy, Check, RefreshCw } from 'lucide-react';

export function SecurityPlaygrounds({ moduleId }: { moduleId: string }) {
  // Encryption State
  const [encSecret, setEncSecret] = useState('vexorion-master-secret-key-32ch');
  const [encPlaintext, setEncPlaintext] = useState('Sensitive payload: credit_card_num=4111222233334444');
  const [encCiphertext, setEncCiphertext] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [encLoading, setEncLoading] = useState(false);

  // Hash State
  const [hashInput, setHashInput] = useState('Vexorion Universal JS Utility');
  const [hashes, setHashes] = useState<{ sha256: string; md5: string; base64: string; sha512: string }>({
    sha256: '',
    md5: '',
    base64: '',
    sha512: ''
  });

  // Token State
  const [tokenSecret, setTokenSecret] = useState('jwt_hmac_secret_2026');
  const [tokenPayload, setTokenPayload] = useState('{"sub": "user_491", "role": "admin"}');
  const [generatedJwt, setGeneratedJwt] = useState('');
  const [verifiedJwt, setVerifiedJwt] = useState<any>(null);
  const [otpCode, setOtpCode] = useState('');
  const [randomHex, setRandomHex] = useState('');

  const encInstance = new useEncryption({ secret: encSecret });
  const hashInstance = new useHash();
  const tokenInstance = new useToken();

  const handleEncrypt = async () => {
    setEncLoading(true);
    try {
      const ct = await encInstance.encrypt(encPlaintext);
      setEncCiphertext(ct || '');
    } finally {
      setEncLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!encCiphertext) return;
    setEncLoading(true);
    try {
      const pt = await encInstance.decrypt(encCiphertext);
      setDecryptedText(pt || '');
    } finally {
      setEncLoading(false);
    }
  };

  const handleComputeHashes = async () => {
    const s256 = await hashInstance.sha256(hashInput);
    const s512 = await hashInstance.sha512(hashInput);
    const md5Hash = hashInstance.md5(hashInput);
    const b64 = hashInstance.base64(hashInput);
    setHashes({ sha256: s256, sha512: s512, md5: md5Hash, base64: b64 });
  };

  const handleGenerateTokens = async () => {
    let payload = { sub: 'user_491', role: 'admin' };
    try {
      payload = JSON.parse(tokenPayload);
    } catch {}

    const jwt = await tokenInstance.generateJWT(payload, tokenSecret, 3600);
    setGeneratedJwt(jwt);

    const verified = await tokenInstance.verifyJWT(jwt, tokenSecret);
    setVerifiedJwt(verified);

    const otp = tokenInstance.generateOTP(6, 300);
    setOtpCode(otp.code);

    const hex = tokenInstance.generate(16);
    setRandomHex(hex);
  };

  if (moduleId === 'hash') {
    return (
      <div className="space-y-5">
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Input Text to Hash</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg text-sm font-mono"
            />
            <button
              onClick={handleComputeHashes}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Compute Digests
            </button>
          </div>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
            <div className="text-neutral-500 uppercase text-[10px] font-bold">SHA-256 Digest (Web Crypto)</div>
            <div className="text-emerald-400 break-all select-all">{hashes.sha256 || 'Click "Compute Digests"'}</div>
          </div>

          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
            <div className="text-neutral-500 uppercase text-[10px] font-bold">MD5 Digest</div>
            <div className="text-amber-400 break-all select-all">{hashes.md5 || 'Click "Compute Digests"'}</div>
          </div>

          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
            <div className="text-neutral-500 uppercase text-[10px] font-bold">Base64 Encoded</div>
            <div className="text-sky-400 break-all select-all">{hashes.base64 || 'Click "Compute Digests"'}</div>
          </div>
        </div>
      </div>
    );
  }

  if (moduleId === 'token') {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">JWT Secret Key</label>
            <input
              type="text"
              value={tokenSecret}
              onChange={(e) => setTokenSecret(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">JWT Payload (JSON)</label>
            <input
              type="text"
              value={tokenPayload}
              onChange={(e) => setTokenPayload(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg text-sm font-mono"
            />
          </div>
        </div>

        <button
          onClick={handleGenerateTokens}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg flex items-center gap-2"
        >
          <Key className="w-4 h-4" /> Generate JWT & OTP Tokens
        </button>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
            <div className="text-neutral-500 uppercase text-[10px] font-bold">Signed HS256 JWT Token</div>
            <div className="text-amber-300 break-all select-all">{generatedJwt || 'None generated yet'}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
              <div className="text-neutral-500 uppercase text-[10px] font-bold">6-Digit One-Time Password (OTP)</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono tracking-widest">{otpCode || '------'}</div>
            </div>
            <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
              <div className="text-neutral-500 uppercase text-[10px] font-bold">16-Byte Cryptographic Hex Key</div>
              <div className="text-sm font-bold text-sky-400 font-mono break-all">{randomHex || '----------------'}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: useEncryption
  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs text-neutral-400 block mb-1">AES Secret Key (PBKDF2 Derived)</label>
        <input
          type="text"
          value={encSecret}
          onChange={(e) => setEncSecret(e.target.value)}
          className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg text-sm font-mono"
        />
      </div>

      <div>
        <label className="text-xs text-neutral-400 block mb-1">Plaintext to Encrypt</label>
        <textarea
          rows={2}
          value={encPlaintext}
          onChange={(e) => setEncPlaintext(e.target.value)}
          className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg text-sm font-mono"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleEncrypt}
          disabled={encLoading}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg flex items-center gap-2"
        >
          <Lock className="w-4 h-4" /> Encrypt (AES-GCM 256)
        </button>
        <button
          onClick={handleDecrypt}
          disabled={encLoading || !encCiphertext}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium rounded-lg border border-neutral-700 flex items-center gap-2 disabled:opacity-50"
        >
          <Unlock className="w-4 h-4" /> Decrypt Base64
        </button>
      </div>

      {encCiphertext && (
        <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1 font-mono text-xs">
          <div className="text-neutral-500 uppercase text-[10px] font-bold">Encrypted IV + Ciphertext (Base64)</div>
          <div className="text-amber-300 break-all select-all">{encCiphertext}</div>
        </div>
      )}

      {decryptedText && (
        <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1 font-mono text-xs">
          <div className="text-neutral-500 uppercase text-[10px] font-bold">Decrypted Plaintext</div>
          <div className="text-emerald-300">{decryptedText}</div>
        </div>
      )}
    </div>
  );
}
