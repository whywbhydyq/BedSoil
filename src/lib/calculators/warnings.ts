export type WarningSeverity = 'info' | 'warning' | 'critical';

export interface CalculatorWarning {
  code: string;
  message: string;
  severity: WarningSeverity;
}

export function warn(code: string, message: string, severity: WarningSeverity = 'warning'): CalculatorWarning {
  return { code, message, severity };
}

export function warningText(warning: CalculatorWarning): string {
  return warning.message;
}
