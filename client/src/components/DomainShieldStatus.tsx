import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DomainShield {
  id: number;
  nameplate: string;
  tarwellDomain: string;
  toritoDomain: string;
  vaultDomain: string;
  sslStatus: string;
  createdAt: Date;
}

interface SSLCertificate {
  domain: string;
  issuer: string;
  expiresAt: Date;
  status: 'valid' | 'pending' | 'expired';
}

export default function DomainShieldStatus({ shield }: { shield: DomainShield }) {
  const [certificates, setCertificates] = useState<SSLCertificate[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Simulate certificate data (will be replaced with real API call)
    const mockCerts: SSLCertificate[] = [
      {
        domain: shield.tarwellDomain,
        issuer: 'Let\'s Encrypt',
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: 'valid',
      },
      {
        domain: shield.toritoDomain,
        issuer: 'Let\'s Encrypt',
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: 'valid',
      },
      {
        domain: shield.vaultDomain,
        issuer: 'Let\'s Encrypt',
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: 'valid',
      },
    ];
    setCertificates(mockCerts);
    setShowAnimation(true);
  }, [shield]);

  return (
    <div className="space-y-4">
      {/* SSL Certificate Status Box */}
      <Card className="bg-black border-green-500 border-2 p-4">
        <div className="font-mono text-green-500 text-sm mb-4">
          [DOMAIN_SHIELD_STATUS] {shield.nameplate.toUpperCase()}
        </div>

        {/* Certificate List */}
        <div className="space-y-3 mb-6">
          {certificates.map((cert) => (
            <div
              key={cert.domain}
              className="bg-gray-900 border border-green-500 p-3 rounded font-mono text-xs"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-green-500">{cert.domain}</span>
                <Badge
                  className={
                    cert.status === 'valid'
                      ? 'bg-green-500 text-black'
                      : 'bg-yellow-500 text-black'
                  }
                >
                  {cert.status.toUpperCase()}
                </Badge>
              </div>
              <div className="text-gray-400">
                Issuer: {cert.issuer}
              </div>
              <div className="text-gray-400">
                Expires: {cert.expiresAt.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Animated Exit/Return Path Visualization */}
        {showAnimation && (
          <div className="space-y-4">
            {/* Exit Path */}
            <div className="border border-brass-500 p-3 rounded bg-black">
              <div className="text-brass-500 font-mono text-xs mb-3">
                [EXIT_SCRUBBER] → TARWELL
              </div>
              <svg viewBox="0 0 300 60" className="w-full h-auto">
                {/* User circle */}
                <circle cx="30" cy="30" r="8" fill="#00ff88" />
                <text x="30" y="50" textAnchor="middle" className="text-xs fill-green-500">
                  YOU
                </text>

                {/* Arrow to TARWELL */}
                <line
                  x1="40"
                  y1="30"
                  x2="100"
                  y2="30"
                  stroke="#ff3366"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
                <polygon points="100,30 95,25 95,35" fill="#ff3366" />

                {/* TARWELL scrubber */}
                <rect x="110" y="15" width="60" height="30" fill="none" stroke="#b08840" strokeWidth="2" />
                <text x="140" y="35" textAnchor="middle" className="text-xs fill-brass-500 font-mono">
                  TARWELL
                </text>

                {/* Arrow to external */}
                <line
                  x1="175"
                  y1="30"
                  x2="235"
                  y2="30"
                  stroke="#00ff88"
                  strokeWidth="2"
                  className="animate-pulse"
                />
                <polygon points="235,30 230,25 230,35" fill="#00ff88" />

                {/* External service */}
                <circle cx="260" cy="30" r="8" fill="#00ff88" />
                <text x="260" y="50" textAnchor="middle" className="text-xs fill-green-500">
                  EXTERNAL
                </text>
              </svg>
              <div className="text-gray-400 text-xs mt-2 font-mono">
                Status: METADATA SCRUBBED | PE_STATE: CLEAN
              </div>
            </div>

            {/* Return Path */}
            <div className="border border-green-500 p-3 rounded bg-black">
              <div className="text-green-500 font-mono text-xs mb-3">
                [RETURN_TUNNEL] ← VAULT
              </div>
              <svg viewBox="0 0 300 60" className="w-full h-auto">
                {/* External service */}
                <circle cx="30" cy="30" r="8" fill="#00ff88" />
                <text x="30" y="50" textAnchor="middle" className="text-xs fill-green-500">
                  EXTERNAL
                </text>

                {/* Arrow back */}
                <line
                  x1="40"
                  y1="30"
                  x2="100"
                  y2="30"
                  stroke="#00ff88"
                  strokeWidth="2"
                  className="animate-pulse"
                />
                <polygon points="100,30 95,25 95,35" fill="#00ff88" />

                {/* VAULT sealer */}
                <rect x="110" y="15" width="60" height="30" fill="none" stroke="#b08840" strokeWidth="2" />
                <text x="140" y="35" textAnchor="middle" className="text-xs fill-brass-500 font-mono">
                  VAULT
                </text>

                {/* Arrow to home */}
                <line
                  x1="175"
                  y1="30"
                  x2="235"
                  y2="30"
                  stroke="#ff3366"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
                <polygon points="235,30 230,25 230,35" fill="#ff3366" />

                {/* Home */}
                <circle cx="260" cy="30" r="8" fill="#00ff88" />
                <text x="260" y="50" textAnchor="middle" className="text-xs fill-green-500">
                  HOME
                </text>
              </svg>
              <div className="text-gray-400 text-xs mt-2 font-mono">
                Status: GARBAGE_SCRUBBED | PROOF_OF_RETURN: SEALED
              </div>
            </div>
          </div>
        )}

        {/* Privacy Statement */}
        <div className="mt-6 p-3 bg-gray-900 border border-green-500 rounded">
          <div className="text-green-500 font-mono text-xs">
            [PRIVACY_GUARANTEE]
          </div>
          <div className="text-gray-300 text-xs mt-2 font-mono">
            Your browsing history is completely private. Only financial transactions
            are recorded for tax purposes. No tracking. No metadata. No history.
          </div>
        </div>
      </Card>
    </div>
  );
}
