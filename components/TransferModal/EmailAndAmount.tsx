'use client';

interface EmailAndAmountProps {
  recipientEmail: string;
  amount: string;
  onEmailChange: (value: string) => void;
  onAmountChange: (value: string) => void;
}

export default function EmailAndAmount({
  recipientEmail,
  amount,
  onEmailChange,
  onAmountChange,
}: EmailAndAmountProps) {
  return (
    <>
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-[#334154] font-medium text-sm">
          Email del destinatario
        </label>
        <input
          type="email"
          value={recipientEmail}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="email@ejemplo.com"
          className="w-full bg-[#f9fafc] rounded-xl px-4 py-3 text-sm text-[#334154] placeholder-[#aaa] outline-none border-2 border-transparent focus:border-[#005cee] transition-all duration-200"
        />
      </div>

      <div className="flex flex-col gap-1.5 mb-6">
        <label className="text-[#334154] font-medium text-sm">
          Monto (USD)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa] text-sm">
            $
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.00"
            min="0"
            className="w-full bg-[#f9fafc] rounded-xl px-4 py-3 pl-8 text-sm text-[#334154] placeholder-[#aaa] outline-none border-2 border-transparent focus:border-[#005cee] transition-all duration-200"
          />
        </div>
      </div>
    </>
  );
}
