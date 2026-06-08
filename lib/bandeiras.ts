const BANDEIRAS: Record<string, string> = {
  // Grupo A
  MEX: '🇲🇽', ECU: '🇪🇨', CRO: '🇭🇷', ALG: '🇩🇿',
  // Grupo B
  POR: '🇵🇹', ARG: '🇦🇷', MAR: '🇲🇦', ANG: '🇦🇴',
  // Grupo C
  USA: '🇺🇸', PAN: '🇵🇦', ALB: '🇦🇱', UKR: '🇺🇦',
  // Grupo D
  BRA: '🇧🇷', JPN: '🇯🇵', CMR: '🇨🇲', CRC: '🇨🇷',
  // Grupo E
  GER: '🇩🇪', ITA: '🇮🇹', KSA: '🇸🇦', SVK: '🇸🇰',
  // Grupo F
  FRA: '🇫🇷', AUS: '🇦🇺', PER: '🇵🇪', CHN: '🇨🇳',
  // Grupo G
  ESP: '🇪🇸', BEL: '🇧🇪', SEN: '🇸🇳', SUI: '🇨🇭',
  // Grupo H
  NED: '🇳🇱', URU: '🇺🇾', TUR: '🇹🇷', IRQ: '🇮🇶',
  // Grupo I
  ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', COL: '🇨🇴', SRB: '🇷🇸', QAT: '🇶🇦',
  // Grupo J
  CAN: '🇨🇦', VEN: '🇻🇪', NZL: '🇳🇿', TJK: '🇹🇯',
  // Grupo K
  KOR: '🇰🇷', CHI: '🇨🇱', IRN: '🇮🇷', GHA: '🇬🇭',
  // Grupo L
  POL: '🇵🇱', AFG: '🇦🇫', RSA: '🇿🇦', BEN: '🇧🇯',
}

export function bandeiraPais(codigo: string): string {
  return BANDEIRAS[codigo] ?? '🏳️'
}
