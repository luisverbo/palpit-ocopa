import { format, formatDistanceToNow, isPast } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toZonedTime } from 'date-fns-tz'

const TZ = 'America/Sao_Paulo'

export function toSaoPaulo(date: string | Date): Date {
  return toZonedTime(new Date(date), TZ)
}

export function formatarDataHora(date: string | Date): string {
  return format(toSaoPaulo(date), "dd/MM HH:mm", { locale: ptBR })
}

export function formatarHora(date: string | Date): string {
  return format(toSaoPaulo(date), "HH:mm", { locale: ptBR })
}

export function formatarData(date: string | Date): string {
  return format(toSaoPaulo(date), "EEEE, dd 'de' MMMM", { locale: ptBR })
}

export function prazoPassou(prazo: string): boolean {
  return isPast(new Date(prazo))
}

export function tempoAte(date: string): string {
  return formatDistanceToNow(new Date(date), { locale: ptBR, addSuffix: true })
}
