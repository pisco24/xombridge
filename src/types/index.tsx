import { PropsWithChildren } from "react";

export interface ExtraTWClassProps {
  className?: string;
}

export type ComponentProps = PropsWithChildren<ExtraTWClassProps>;

export type FormatNumberOptions = {
  prefix?: string;
  suffix?: string;
  thousandSeparator?: boolean | string;
  decimalScale?: number;
  isPercentage?: boolean;
  truncateTinyValue?: boolean;
  useMillify?: boolean;
  placeholder?: string;
};

export interface BridgeStepProps {
  amount: number;
  from: number;
  to: number;
  estimatedGas: number;
  estimatedTime: string;
  symbol: string;
  fee: number;
}

export interface AgreedProps {
  agreed: boolean;
  setAgreed: (value: boolean) => void;
}

export interface ModalProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  stepProps: BridgeStepProps;
};

export interface ConnectModalProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
};

export interface NetworkInfo {
  chainId: number,
  endpointId: number,
  symbol: string,
  label: string,
  bridge: string,
  scanUrl: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any,
  width?: string,
  height?: string
};

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  isNative: boolean;
  fee: number;
  chainId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
}

export interface TokenBalance {
  symbol: string;
  balance: string;
  // price: string;
}
