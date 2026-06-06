const BANDEIRAS: Record<string, string> = {
  BRA: '🇧🇷', ARG: '🇦🇷', FRA: '🇫🇷', GER: '🇩🇪', ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  ESP: '🇪🇸', POR: '🇵🇹', ITA: '🇮🇹', NED: '🇳🇱', BEL: '🇧🇪',
  URU: '🇺🇾', COL: '🇨🇴', MEX: '🇲🇽', USA: '🇺🇸', CAN: '🇨🇦',
  SEN: '🇸🇳', GHA: '🇬🇭', MAR: '🇲🇦', CMR: '🇨🇲', TUN: '🇹🇳',
  JPN: '🇯🇵', KOR: '🇰🇷', AUS: '🇦🇺', IRN: '🇮🇷', KSA: '🇸🇦',
  QAT: '🇶🇦', SUI: '🇨🇭', CRO: '🇭🇷', POL: '🇵🇱', DEN: '🇩🇰',
  SRB: '🇷🇸', WAL: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', ECU: '🇪🇨', GAB: '🇬🇦', CRC: '🇨🇷',
  CMR2: '🇨🇲', PAN: '🇵🇦', HON: '🇭🇳', SVK: '🇸🇰', HUN: '🇭🇺',
  SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', ALB: '🇦🇱', SLO: '🇸🇮', UKR: '🇺🇦', CZE: '🇨🇿',
  ROU: '🇷🇴', TUR: '🇹🇷', GEO: '🇬🇪', AUT: '🇦🇹',
}

export function bandeiraPais(codigo: string): string {
  return BANDEIRAS[codigo] ?? '🏳️'
}
